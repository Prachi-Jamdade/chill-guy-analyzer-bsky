"use client";

import { useState, useEffect } from "react";
import { getChillGuyAnalysis } from "@/api/fetch-posts";

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(""); 
  const [loading, setLoading] = useState(false); 

  // Function to handle fetching the Chill Guy analysis
  const handleFetchAnalysis = async () => {
    if (!username) {
      setError("Please enter a valid username");
      return;
    }

    setLoading(true);
    setError(null); 
    setAnalysis(null); 

    try {
      const result = await getChillGuyAnalysis(username); 
      console.log("Analysis result:", result);
      setAnalysis(result); 

    } catch (err) {
      console.error("Error in handleFetchAnalysis:", err);
      setError(err.message || "An error occurred during analysis");
      setAnalysis(null);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Chill Guy Analysis</h1>

      {/* Chill Guy Meme Image */}
      <div className="mb-8">
        <img
          src="/assets/chill-guy.png"
          alt="Chill Guy Meme"
          className="w-56 h-56 object-cover rounded-full mx-auto"
        />
      </div>

      {/* Input and Button Row */}
      <div className="flex items-center w-full max-w-xl space-x-4 mb-6">
        {/* TextField for bsky username */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Enter bsky username"
          className="p-3 text-gray-800 border-2 border-indigo-500 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Button to fetch the analysis */}
        <button
          onClick={handleFetchAnalysis}
          disabled={loading} 
          className="p-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 min-w-[160px] whitespace-nowrap min-w-[160px] whitespace-nowrap"
        >
          Get Your Score
        </button>
      </div>


      {loading && (
        <div className="w-full max-w-xl mb-6">
          <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full animate-pulse" style={{ width: "100%" }}></div>
          </div>
          <p className="text-center text-indigo-600 mt-2">Analyzing posts... This may take a moment</p>
        </div>
      )}

      {/* Display error or analysis */}
      {error && <p className="text-red-600 font-medium text-lg mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

      {analysis ? (
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-4 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">Analysis Results</h2>
            <div className="whitespace-pre-line text-lg mb-4 text-gray-800 font-medium">{analysis.text}</div>

            {/* Score display with visual indicator */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Chill Guy Score: <span className="text-indigo-600">{analysis.score}/100</span></h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-indigo-600 h-4 rounded-full"
                  style={{ width: `${analysis.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !loading && <p className="text-gray-700 text-center text-lg font-medium p-4 bg-gray-50 rounded-lg border border-gray-200">Please enter a username and get the analysis!</p>
      )}
    </div>
  );
}
