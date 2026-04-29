import User from "@/models/user.model.js";
import Token from "@/models/token.model.js";
import ExpressError from "@/utils/ExpressError.util.js";
import {
    generateAndSetJWT,
    generateVerificationToken,
    generateResetPasswordToken,
    decodeJWT,
} from "@/utils/generateJWT.utils.js";
import { sanitizeUser } from "@/utils/sanitize.util.js";
import getGoogleOAuthTokens, { verifyGoogleIdToken } from "@/utils/getGoogleOAuth.util.js";
import { NextResponse } from "next/server";

import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendForgotPasswordEmail,
    sendResetPasswordEmail,
} from "@/utils/mails.util.js";

const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
};

function setAuthCookie(response, token) {
    response.cookies.set("token", token, AUTH_COOKIE_OPTIONS);
}

function clearAuthCookie(response) {
    response.cookies.delete("token");
}

function issueJwt(userId) {
    const token = generateAndSetJWT(userId);
    if (!token) {
        throw new ExpressError(500, "JWT configuration missing");
    }
    return token;
}

async function decodingUser(req) {
    const tokenrec = req.cookies.get("token");

    if (!tokenrec || !tokenrec.value) {
        return null;
    }

    const decodedJwt = decodeJWT(tokenrec.value);

    if (!decodedJwt || !decodedJwt._id) {
        return null;
    }

    const user = await User.findOne({ _id: decodedJwt._id });
    return user || null;
}


// ---------------- STATUS ----------------
export async function handleStatus(req) {
    const userGot = await decodingUser(req);

    if (!userGot) {
        return NextResponse.json(
            {
                success: false,
                message: "User is not authenticated",
                data: { user: null },
            },
            { status: 401 }
        );
    }

    const resData = {
        success: true,
        message: "User Logged in Successfully",
        data: {
            user: sanitizeUser(userGot)
        }
    }
    return NextResponse.json(resData, { status: 200 });
    // res.status(200).json({
    //     success: true,
    //     message: "User is logged in",
    //     data: {
    //         user: sanitizeUser(req.user),
    //     },
    // });
}

// ---------------- REGISTER ----------------
export async function handleRegister(req) {
    const { name, email, phone, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (existingUser.googleId && !existingUser.password) {
            existingUser.name = name || existingUser.name;
            existingUser.password = password;

            await existingUser.save();
            const token = issueJwt(existingUser._id);

            const resData = {
                success: true,
                message: "User registered successfully",
                data: { user: sanitizeUser(existingUser) },
            }
            const response = NextResponse.json(resData, { status: 200 })
            setAuthCookie(response, token);
            // res.status(200).json({
            //     success: true,
            //     message: "User registered successfully",
            //     data: { user: sanitizeUser(existingUser) },
            // });
            return response;
        } else {
            throw new ExpressError(400, "User already exists");
        }
    }

    const verificationToken = generateVerificationToken();
    await sendVerificationEmail(email, verificationToken);

    const newUser = new User({
        name,
        email,
        phone,
        password,
    });
    await newUser.save();

    const newToken = new Token({
        value: verificationToken,
        user_id: newUser._id,
        type: "verification",
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    });
    await newToken.save();

    const token = issueJwt(newUser._id);

    const resData = {
        success: true,
        message: "User registered successfully",
        data: {
            user: sanitizeUser(newUser),
        },
    }
    const response = NextResponse.json(resData, { status: 201 });
    setAuthCookie(response, token);
    // res.status(201).json({
    //     success: true,
    //     message: "User registered successfully",
    //     data: {
    //         user: sanitizeUser(newUser),
    //     },
    // });
    return response;
}

// ---------------- SEND VERIFICATION ----------------
export async function handleSendVerification(req) {
    const user = await decodingUser(req);
    if (!user) {
        throw new ExpressError(401, "User is not authenticated");
    }

    const existingToken = await Token.findOne({
        user_id: user._id,
        type: "verification",
    });

    const newVerificationToken = generateVerificationToken();
    await sendVerificationEmail(user.email, newVerificationToken);

    if (existingToken) {
        existingToken.value = newVerificationToken;
        existingToken.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await existingToken.save();
    } else {
        const newToken = new Token({
            value: newVerificationToken,
            user_id: user._id,
            type: "verification",
            expiresAt: Date.now() + 60 * 60 * 1000,
        });
        await newToken.save();
    }

    const resData = {
        success: true,
        message: "Verification code sent successfully",
    }
    return NextResponse.json(resData, { status: 201 })
    // res.status(201).json({
    //     success: true,
    //     message: "Verification code sent successfully",
    // });
}

// ---------------- VERIFY EMAIL ----------------
export async function handleVerifyEmail(req) {
    const { code } = await req.json();
    const user = await decodingUser(req);
    if (!user) {
        throw new ExpressError(401, "User is not authenticated");
    }

    const token = await Token.findOne({
        value: code,
        user_id: user._id,
        type: "verification",
    });

    if (!token || token.expiresAt < new Date())
        throw new ExpressError(400, "Invalid or expired token");

    user.isVerified = true;
    await user.save();
    await token.deleteOne();

    await sendWelcomeEmail(user.email, user.name);

    const resData = {
        success: true,
        message: "Email verified successfully",
        data: {
            user: sanitizeUser(user),
        },
    };
    return NextResponse.json(resData, { status: 200 })
    // res.status(200).json({
    //     success: true,
    //     message: "Email verified successfully",
    //     data: {
    //         user: sanitizeUser(user),
    //     },
    // });
}

// ---------------- LOGIN ----------------
export async function handleLogin(req) {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) throw new ExpressError(400, "User does not exist");

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new ExpressError(400, "Invalid Password");

    const token = issueJwt(user._id);

    const resData = {
        success: true,
        message: "User logged in successfully",
        data: {
            user: sanitizeUser(user),
        },
    };
    const response = NextResponse.json(resData, { status: 200 });
    setAuthCookie(response, token);
    // res.status(200).json({
    //     success: true,
    //     message: "User logged in successfully",
    //     data: {
    //         user: sanitizeUser(user),
    //     },
    // });
    return response;
}

// ---------------- LOGOUT ----------------
export async function handleLogout() {

    const resData = {
        success: true,
        message: "Logged out successfully",
    };
    const response = NextResponse.json(resData, { status: 200 })
    // res.status(200).json({
    //     success: true,
    //     message: "Logged out successfully",
    // });
    clearAuthCookie(response);
    return response;
}

// ---------------- FORGOT PASSWORD ----------------
export async function handleForgotPassword(req) {
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) throw new ExpressError(400, "User does not exist");

    const resetToken = generateResetPasswordToken();

    const newToken = new Token({
        value: resetToken,
        user_id: user._id,
        type: "reset",
        expiresAt: Date.now() + 1 * 60 * 60 * 1000, // 1 hour
    });

    await newToken.save();

    const resetUrl = `${process.env.SERVER_URL}/reset-password/${resetToken}`;
    await sendForgotPasswordEmail(email, resetUrl);

    const resData = {
        success: true,
        message: "Reset Password Link sent successfully.",
    }
    return NextResponse.json(resData, { status: 200 });
    // res.status(200).json({
    //     success: true,
    //     message: "Reset Password Link sent successfully.",
    // });
}

// ---------------- RESET PASSWORD ----------------
export async function handleResetPassword(req, { params }) {
    const resetToken = params.token;
    const { password } = await req.json();

    const token = await Token.findOne({ value: resetToken });
    if (!token || token.expiresAt < new Date())
        throw new ExpressError(400, "Invalid or expired token");

    const user = await User.findOne({ _id: token.user_id });
    if (!user) throw new ExpressError(400, "User does not exist");

    user.password = password;
    await user.save();
    await token.deleteOne();

    await sendResetPasswordEmail(user.email);

    const resData = {
        success: true,
        message: "Password reset successful",
    };
    return NextResponse.json(resData, { status: 200 });
    // res.send({
    //     success: true,
    //     message: "Password reset successful",
    // });
}

// ---------------- GOOGLE AUTH ----------------
export async function handleGoogleAuth(req) {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) throw new ExpressError(400, "Missing Google authorization code.");

    const obj = await getGoogleOAuthTokens(code);
    const googleUser = await verifyGoogleIdToken(obj.id_token);

    let user = await User.findOne({
        $or: [{ googleId: googleUser.sub }, { email: googleUser.email }],
    });

    if (!user) {
        user = new User({
            name: googleUser.name || googleUser.email,
            email: googleUser.email,
            googleId: googleUser.sub,
            isVerified: true,
        });

        await user.save();
        await sendWelcomeEmail(user.email, user.name);
    } else if (!user.googleId) {
        user.isVerified = true;
        user.googleId = googleUser.sub;
        await user.save();
    }

    const token = issueJwt(user._id);
    const response = NextResponse.redirect(process.env.CLIENT_URL);
    setAuthCookie(response, token);
    return response;
}
