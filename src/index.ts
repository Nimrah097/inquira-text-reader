// src/index.ts

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { askQuestion } from "./langchain";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// POST /ask endpoint
app.post("/ask", async (req: Request, res: Response): Promise<void> => {
  const { document, question } = req.body;

  if (!document || !question) {
    res.status(400).json({ error: "Both document and question are required" });
    return;
  }

  try {
    const answer = await askQuestion(document, question);
    res.json({ answer });
  } catch (error) {
    console.error("Error in /ask:", error);
    res.status(500).json({ error: "Failed to get answer from AI model" });
  }
});

// Serve frontend HTML
app.get("/", (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "../public/splash.html"));
});

// Start server
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
