import transporter from "@/config/mailProvider.config.js";
import ExpressError from "@/utils/ExpressError.util.js";
import {
  VERIFICATION_TEMPLATE,
  WELCOME_TEMPLATE,
  FORGOT_PASSWORD_TEMPLATE,
  RESET_PASSWORD_TEMPLATE,
} from "./mailTemplates.util.js";

const isLocalUrl = (value = "") => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

const getClientUrl = () => {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.CLIENT_URL?.split(",")[0]?.trim(),
    "https://conch.bhavyadhanwani.dev",
  ].filter(Boolean);
  const selected = candidates.find((url) => process.env.NODE_ENV !== "production" || !isLocalUrl(url));

  return (selected || "https://conch.bhavyadhanwani.dev").replace(/\/$/, "");
};

export async function sendVerificationEmail(email, verificationToken) {
  const mailOptions = {
    from: `"Bhavyaz Portfolio" <${process.env.TRANSACTIONAL_DOMAIN}>`,
    to: email,
    subject: "Verify your Email",
    html: VERIFICATION_TEMPLATE.replace("{verificationToken}", verificationToken),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ExpressError(500, "Failed to send verification email");
  }
}

export async function sendWelcomeEmail(email, name) {
  const mailOptions = {
    from: `"Bhavyaz Portfolio" <${process.env.TRANSACTIONAL_DOMAIN}>`,
    to: email,
    subject: "Welcome to Dole Shole",
    html: WELCOME_TEMPLATE.replace("{name}", name).replace(
      "{dashboardURL}",
      `${getClientUrl()}/dashboard`
    ),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ExpressError(500, "Failed to send welcome email");
  }
}

export async function sendForgotPasswordEmail(email, resetUrl) {
  const mailOptions = {
    from: `"Bhavyaz Portfolio" <${process.env.TRANSACTIONAL_DOMAIN}>`,
    to: email,
    subject: "Reset Your Password",
    html: FORGOT_PASSWORD_TEMPLATE.replace("{resetURL}", resetUrl),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ExpressError(500, "Failed to send forgot password email");
  }
}

export async function sendResetPasswordEmail(email) {
  const mailOptions = {
    from: `"Bhavyaz Portfolio" <${process.env.TRANSACTIONAL_DOMAIN}>`,
    to: email,
    subject: "Password Reset Successful",
    html: RESET_PASSWORD_TEMPLATE,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new ExpressError(500, "Failed to send reset password email");
  }
}
