import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchUserPosts } from "./bluesky";
import 'dotenv/config';

// Get API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getChillGuyAnalysis(username) {
  try {
    console.log(`Fetching posts for user: ${username}`);
    const posts = await fetchUserPosts(username);
    console.log(`Successfully fetched ${posts.length} posts`);

    // Check if posts array is valid
    if (!posts || posts.length === 0) {
      throw new Error("No posts available to analyze.");
    }

    const prompt = `
      Analyze the following posts from a Bluesky user and provide an honest, unfiltered assessment of their "chill factor" - how relaxed, positive, and easy-going they seem.

      Guidelines:
      - Be authentic and realistic in your assessment
      - Focus on their attitude, tone, and content
      - Avoid exaggeration or overly formal language
      - No need to include example replies in your response
      - Include how they are doing in their respective niche and field
      - Keep your response to 5-8 sentences
      - End with a "Chill Guy Score" out of 100 that feels genuine (not artificially high or low)
      - Consider both positive and negative aspects of their communication style
      - Keep the language simple, conversational and without jargons

      Posts to analyze:
      ${posts.join("\n\n")}
    `;

    console.log("Sending prompt to Gemini model...");
    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("Received empty response from Gemini model");
    }

    const analysisText = result.response.text();
    console.log("Analysis complete:", analysisText);

    // Extract the score from the text using regex
    // This regex looks for patterns like "Score: 75/100", "Chill Guy Score: 75", etc.
    const scoreRegex = /(?:score|rating)(?:\s*(?:is|:))?\s*(\d{1,3})(?:\s*\/\s*100|\s*out of\s*100)?/i;
    const scoreMatch = analysisText.match(scoreRegex);

    let score = null;
    if (scoreMatch && scoreMatch[1]) {
      score = parseInt(scoreMatch[1], 10);
      console.log("Extracted score:", score);

      // Validate the score is within reasonable bounds
      if (score < 0) score = 0;
      if (score > 100) score = 100;
    } else {
      console.warn("Could not extract score from response, generating a realistic default");
      
      score = Math.floor(Math.random() * 31) + 55;
      console.log("Using generated score:", score);
    }

    return {
      text: analysisText,
      score: score
    };
  } catch (error) {
    console.error("Error generating analysis:", error);

    if (error.message.includes("Failed to fetch posts")) {
      console.error("The error occurred while trying to fetch posts from Bluesky. Please check the username and try again.");
    } else if (error.message.includes("No posts available")) {
      console.error("The user exists but has no posts to analyze.");
    } else if (error.message.includes("Gemini model")) {
      console.error("There was an issue with the AI model. Please try again later.");
    }

    throw error; 
  }
}
