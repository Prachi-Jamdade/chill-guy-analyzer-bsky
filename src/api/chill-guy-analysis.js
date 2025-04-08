import { getChillGuyAnalysis } from "./langchain";

export default async function handler(req, res) {
    if (req.method === "GET") {
      try {
        const analysisResult = await getChillGuyAnalysis();
        res.status(200).json({ result: analysisResult });
      } catch (error) {
        console.error("Error fetching analysis:", error);
        res.status(500).json({ error: "Failed to fetch analysis" });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
