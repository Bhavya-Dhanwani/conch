import dotenv from "dotenv";
dotenv.config();

import { buildPrompt } from "./prompt.js";
import { formatResponse } from "./formatter.js";
import { analyzeInput } from "./analyzer.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { logs, error, code } = await req.json();

    // ✅ Input validation
    if (!logs || !error || !code) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("GEN-AI API HIT");

    // 🔍 Smart hints
    const hints = analyzeInput({ logs, error, code });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: process.env.MODEL || "gemini-flash-latest",
    });

    const prompt = buildPrompt({ logs, error, code, hints });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({
      success: true,
      report: formatResponse(text),
    });

  } catch (err) {
    console.error(err);

    return Response.json(
      {
        success: false,
        error: "AI processing failed",
        details: err.message,
      },
      { status: 500 }
    );
  }
}