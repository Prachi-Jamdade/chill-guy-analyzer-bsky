import { AtpAgent } from "@atproto/api";
import 'dotenv/config';

const agent = new AtpAgent({
  service: "https://bsky.social",
});

// Initialize a variable to track if we've logged in
let isLoggedIn = false;

// Function to ensure login happens before fetching posts
async function ensureLogin() {
  if (!isLoggedIn) {
    try {
      // Get credentials from environment variables
      const identifier = process.env.BSKY_USERNAME;
      const password = process.env.BSKY_PASSWORD;
      
      // Check if credentials are available
      if (!identifier || !password) {
        throw new Error("Bluesky credentials not found in environment variables");
      }
      
      await agent.login({
        identifier,
        password,
      });
      isLoggedIn = true;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Failed to authenticate with Bluesky");
    }
  }
}

export async function fetchUserPosts(username) {
  try {
    // Ensure we're logged in before fetching posts
    await ensureLogin();

    const { data } = await agent.getAuthorFeed({
      actor: username,
      limit: 10, // Uncommented to limit the number of posts
    });

    // Check if we have any posts
    if (!data.feed || data.feed.length === 0) {
      throw new Error("No posts found for this user");
    }

    console.log("First post:", data.feed[0].post.record.text);

    // Extract the text from each post
    return data.feed.map((post) => {
      // Make sure post has the expected structure
      if (post && post.post && post.post.record && post.post.record.text) {
        return post.post.record.text;
      } else {
        console.warn("Found a post with unexpected structure:", post);
        return ""; // Return empty string for posts with unexpected structure
      }
    }).filter(text => text !== ""); // Filter out empty strings
  } catch (error) {
    console.error("Error details:", error);
    throw new Error(error.message || error.response?.data || "Failed to fetch posts");
  }
}
