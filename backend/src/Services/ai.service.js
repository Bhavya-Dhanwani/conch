import { GoogleGenerativeAI } from "@google/generative-ai";

import Logs from "../Models/log.model.js";
import {
  analyzeInput,
  buildPrompt,
  parseAIResponse,
} from "../Utilities/aiPrompt.js";

const MAX_TEXT_LENGTH = 12000;

const toText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
};

const limitText = (value) => toText(value).slice(0, MAX_TEXT_LENGTH);

const normalizeSeverity = (severity) => {
  const normalized = String(severity || "").toUpperCase();

  if (normalized.includes("HIGH") || normalized.includes("CRITICAL")) {
    return "HIGH";
  }
  if (normalized.includes("MEDIUM")) return "MEDIUM";
  return "LOW";
};

const formatReportForLog = (report) => {
  const fixSteps = Array.isArray(report.fix_steps) ? report.fix_steps : [];
  const prevention = Array.isArray(report.prevention) ? report.prevention : [];

  return {
    analysis:
      report.explanation ||
      report.root_cause ||
      "AI analysis completed, but no explanation was returned.",
    solution: fixSteps.join("\n") || report.corrected_code || "",
    severity: normalizeSeverity(report.severity),
    rootCause: report.root_cause || "",
    where: report.where || "",
    when: report.when || "",
    fixSteps,
    correctedCode: report.corrected_code || "",
    prevention,
    confidence: report.confidence || "",
  };
};

const formatIncidentPostmortem = (report) => {
  return {
    summary: report.summary || report.explanation || "",
    rootCause: report.root_cause || report.rootCause || "",
    resolution: report.resolution || report.solution || "",
    prevention: Array.isArray(report.prevention) ? report.prevention : [],
    impact: report.impact || "",
  };
};

const buildLogAIInput = (log) => {
  const error = `${log.errorName || "Error"}: ${log.errorMessage}`;
  const logs = [
    `Stack trace:\n${limitText(log.stackTrace) || "Not provided"}`,
    `Metadata:\n${limitText(log.metadata) || "Not provided"}`,
  ].join("\n\n");
  const code = limitText(log.codeSnippet);

  return { logs, error, code };
};

export const analyzeLog = async (log) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for AI analysis");
  }

  const input = buildLogAIInput(log);
  const hints = analyzeInput(input);
  const prompt = buildPrompt({ ...input, hints });

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || process.env.MODEL || "gemini-flash-latest",
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const report = parseAIResponse(text);

  return formatReportForLog(report);
};

export const generateIncidentPostmortem = async (incident) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for AI postmortem generation");
  }

  const incidentText = limitText({
    title: incident.title,
    description: incident.description,
    severity: incident.severity,
    status: incident.status,
    publicStatus: incident.publicStatus,
    sourceLog: incident.sourceLog,
    updates: incident.updates,
    timeline: incident.timeline,
  });

  const prompt = `
You are a senior incident commander writing a production incident postmortem.

Use the incident data below and return only valid JSON. Do not wrap the JSON in markdown.

INCIDENT:
${incidentText}

Return this exact JSON shape:
{
  "summary": "",
  "impact": "",
  "root_cause": "",
  "resolution": "",
  "prevention": ["action item 1", "action item 2"]
}
`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || process.env.MODEL || "gemini-flash-latest",
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const report = parseAIResponse(text);

  return formatIncidentPostmortem(report);
};

export const analyzeAndUpdateLog = async (logId) => {
  const log = await Logs.findById(logId).lean();
  if (!log) return null;

  try {
    const aiReport = await analyzeLog(log);

    return Logs.findByIdAndUpdate(
      logId,
      {
        $set: {
          aiReport,
          status: "ANALYZED",
        },
      },
      { returnDocument: "after" },
    ).lean();
  } catch (error) {
    console.error("AI analysis failed:", error.message);

    return Logs.findByIdAndUpdate(
      logId,
      {
        $set: {
          status: "FAILED",
          aiReport: {
            analysis: "AI analysis failed.",
            solution: error.message,
            severity: "LOW",
          },
        },
      },
      { returnDocument: "after" },
    ).lean();
  }
};

export const queueLogAnalysis = (logId) => {
  if (process.env.AI_ANALYSIS_ENABLED === "false") return;

  setImmediate(() => {
    analyzeAndUpdateLog(logId).catch((error) => {
      console.error("AI analysis worker crashed:", error.message);
    });
  });
};
