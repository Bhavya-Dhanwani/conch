export default function getGoogleUrl() {
    const rootUrl = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;

    const options = {
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_AUTH_REDIRECT_URL,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        access_type: "offline", // get refresh token
        response_type: "code", // get authorization code
        prompt: "consent", // always show google consent screen
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
}
