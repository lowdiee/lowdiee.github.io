export default async function handler(req, res) {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const redirectUri = "https://oauth.pstmn.io/v1/callback";

  const scope =
    "https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/youtube.readonly";

  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope,
    });

  res.redirect(authUrl);
}
