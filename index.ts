import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { askQuestion } from "./langchain";
import type { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Dynamic port for Replit

app.use(cors());
app.use(bodyParser.json());

app.post("/ask", async (req: Request, res: Response): Promise<void> => {
  const { documentText, question } = req.body;

  if (!documentText || !question) {
    res.status(400).json({ error: "Missing documentText or question" });
    return;
  }

  try {
    const answer = await askQuestion(documentText, question);
    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
