"use strict";
// src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const langchain_1 = require("./langchain");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
// POST /ask endpoint
app.post("/ask", async (req, res) => {
    const { document, question } = req.body;
    if (!document || !question) {
        res.status(400).json({ error: "Both document and question are required" });
        return;
    }
    try {
        const answer = await (0, langchain_1.askQuestion)(document, question);
        res.json({ answer });
    }
    catch (error) {
        console.error("Error in /ask:", error);
        res.status(500).json({ error: "Failed to get answer from AI model" });
    }
});
// Serve frontend HTML
app.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/splash.html"));
});

app.get("/test", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public"));
});

// Start server
app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
