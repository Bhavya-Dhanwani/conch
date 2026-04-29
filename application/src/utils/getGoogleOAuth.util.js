import axios from "axios";
import qs from "querystring";
import ExpressError from "@/utils/ExpressError.util.js";

export default async function getGoogleOAuthTokens(code) {
  const url = process.env.GOOGLE_ACCESS_TOKEN_URL;

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (err) {
    throw new ExpressError(500, "Failed to fetch Google OAuth tokens");
  }
}

export async function verifyGoogleIdToken(idToken) {
  if (!idToken) {
    throw new ExpressError(400, "Missing Google ID token");
  }

  try {
    const res = await axios.get("https://oauth2.googleapis.com/tokeninfo", {
      params: { id_token: idToken },
    });
    const googleUser = res.data;
    const validIssuers = new Set(["https://accounts.google.com", "accounts.google.com"]);

    if (!validIssuers.has(googleUser.iss)) {
      throw new ExpressError(401, "Invalid Google token issuer");
    }

    if (googleUser.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new ExpressError(401, "Invalid Google token audience");
    }

    if (!googleUser.email || !googleUser.sub) {
      throw new ExpressError(401, "Invalid Google token payload");
    }

    return googleUser;
  } catch (err) {
    if (err instanceof ExpressError) {
      throw err;
    }

    throw new ExpressError(401, "Invalid Google ID token");
  }
}
