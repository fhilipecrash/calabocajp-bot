const { DISCORD_TOKEN, DISCORD_CLIENT_ID, YOUTUBE_ACCESS_TOKEN } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !YOUTUBE_ACCESS_TOKEN ) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  YOUTUBE_ACCESS_TOKEN
};
