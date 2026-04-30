import express from "express";
import dotenv from "dotenv";
import { buildPrompt } from "./prompt.js";
import { formatResponse } from "./formatter.js";
import { analyzeInput } from "./analyzer.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

//server run check
app.get("/", (req, res) => {
  res.send("Gen-AI Server Running 🚀");
});

//test
app.get("/api/gen-ai", async (req, res) => {
  try {
    const logs = "Cannot read property 'name'";
    const error = "TypeError: undefined";
    const code = "user.name.toUpperCase()";

    const hints = analyzeInput({ logs, error, code });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: process.env.MODEL || "gemini-flash-latest",
    });

    const prompt = buildPrompt({ logs, error, code, hints });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({
      success: true,
      report: formatResponse(text),
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.post("/api/gen-ai", async (req, res) => {
  try {
    const { logs, error, code } = req.body;

    if (!logs || !error || !code) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    console.log("API HIT");

    const hints = analyzeInput({ logs, error, code });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: process.env.MODEL || "gemini-flash-latest",
    });

    const prompt = buildPrompt({ logs, error, code, hints });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({
      success: true,
      report: formatResponse(text),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});