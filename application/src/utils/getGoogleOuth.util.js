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
    throw new ExpressError(500, `Failed to fetch Google OAuth Tokens: ${err}`);
  }
}
