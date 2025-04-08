/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make environment variables available to the browser
  env: {
    BSKY_USERNAME: process.env.BSKY_USERNAME,
    BSKY_PASSWORD: process.env.BSKY_PASSWORD,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
