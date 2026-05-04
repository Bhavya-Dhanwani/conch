import { GoogleGenerativeAI } from "@google/generative-ai";

import Incidents from "../Models/incident.model.js";
import Logs from "../Models/log.model.js";
import Users from "../Models/user.model.js";
import sendEmail from "../Utilities/sendEmail.js";
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

const fallbackTimelinePlan = (severity = "MEDIUM") => {
  const high = ["HIGH", "CRITICAL"].includes(String(severity).toUpperCase());

  return [
    {
      title: "Confirm impact",
      description: "Reproduce the failure, capture affected route, user impact, and first bad timestamp.",
      owner: "Incident lead",
      dueInMinutes: high ? 10 : 20,
    },
    {
      title: "Isolate root cause",
      description: "Use the stack trace, recent deploys, and AI report to identify the failing module.",
      owner: "Assigned team",
      dueInMinutes: high ? 20 : 45,
    },
    {
      title: "Ship fix or rollback",
      description: "Apply the lowest-risk correction, rollback, or feature disablement and verify recovery.",
      owner: "Assigned team",
      dueInMinutes: high ? 40 : 90,
    },
    {
      title: "Monitor and document",
      description: "Watch logs after the fix, update status, and prepare the postmortem notes.",
      owner: "Manager",
      dueInMinutes: high ? 60 : 120,
    },
  ];
};

const formatTimelinePlan = (report, severity) => {
  const steps = Array.isArray(report.timeline) ? report.timeline : report.steps;
  if (!Array.isArray(steps) || !steps.length) return fallbackTimelinePlan(severity);

  return steps.slice(0, 6).map((step, index) => ({
    title: step.title || step.name || `Response step ${index + 1}`,
    description: step.description || step.action || "",
    owner: step.owner || "Assigned team",
    dueInMinutes: Number(step.dueInMinutes || step.due_in_minutes || (index + 1) * 30),
  }));
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

const heuristicLogReport = (log) => {
  const text = [
    log.errorName,
    log.errorMessage,
    limitText(log.stackTrace),
    limitText(log.codeSnippet),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const severity =
    /auth|token|database|db|crash|fatal|hydration|chunk|application failed|white screen/i.test(text)
      ? "HIGH"
      : /cannot read|undefined is not|failed to fetch|typo|referenceerror|typeerror|runtime|validation|missing/i.test(text)
        ? "MEDIUM"
        : "LOW";

  return {
    analysis: "Local CONCH analysis classified this event without an external AI key.",
    solution:
      severity === "HIGH"
        ? "Check the failing stack frame, recent deploy, and authentication or data dependencies. Roll back if the main path is unavailable."
        : severity === "MEDIUM"
          ? "Inspect the named component or function and add a focused regression test after the fix."
          : "Check asset paths, optional fields, and non-blocking UI resources.",
    severity,
    rootCause: log.errorMessage,
    where: log.metadata?.url || "Captured runtime location",
    when: log.createdAt || new Date().toISOString(),
    fixSteps:
      severity === "HIGH"
        ? ["Reproduce the failing path", "Inspect the top stack frame", "Patch or roll back", "Verify status recovery"]
        : ["Reproduce locally", "Patch the failing line", "Add a regression check"],
    correctedCode: "",
    prevention: ["Add monitoring for this path", "Cover the failure with a test"],
    confidence: "fallback",
  };
};

export const generateIncidentTimelinePlan = async ({ incident, log } = {}) => {
  const severity = incident?.severity || log?.aiReport?.severity || "MEDIUM";

  if (!process.env.GEMINI_API_KEY) {
    return fallbackTimelinePlan(severity);
  }

  const incidentText = limitText({
    title: incident?.title,
    description: incident?.description,
    severity,
    log,
  });

  const prompt = `
You are an incident commander. Build a practical response timeline for this production issue.

INCIDENT:
${incidentText}

Return only valid JSON:
{
  "timeline": [
    {
      "title": "",
      "description": "",
      "owner": "Manager or Assigned team",
      "dueInMinutes": 30
    }
  ]
}
`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || process.env.MODEL || "gemini-flash-latest",
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const report = parseAIResponse(text);
    return formatTimelinePlan(report, severity);
  } catch (error) {
    console.error("AI timeline generation failed:", error.message);
    return fallbackTimelinePlan(severity);
  }
};

export const analyzeLog = async (log) => {
  if (!process.env.GEMINI_API_KEY) {
    return heuristicLogReport(log);
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
    return {
      summary: `${incident.title} was handled through the CONCH incident workflow.`,
      rootCause:
        incident.sourceLog?.aiReport?.rootCause ||
        incident.sourceLog?.errorMessage ||
        "Root cause needs manager confirmation.",
      resolution:
        incident.updates?.at(-1)?.message ||
        "Resolution details should be completed by the assigned responders.",
      prevention: [
        "Add a regression check for the failing path.",
        "Improve monitoring around the affected feature.",
      ],
      impact: incident.description || "Impact should be completed during review.",
    };
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

    const updatedLog = await Logs.findByIdAndUpdate(
      logId,
      {
        $set: {
          aiReport,
          status: "ANALYZED",
        },
      },
      { returnDocument: "after" },
    ).lean();

    await createIncidentFromHighSeverityLog(updatedLog);

    return updatedLog;
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

const getPublicStatusForSeverity = (severity) => {
  if (severity === "HIGH") return "PARTIAL_OUTAGE";
  if (severity === "MEDIUM") return "DEGRADED";
  return "OPERATIONAL";
};

const createIncidentFromHighSeverityLog = async (log) => {
  if (!log || !["HIGH"].includes(log.aiReport?.severity)) return null;

  const existingIncident = await Incidents.findOne({ sourceLog: log._id }).lean();
  if (existingIncident) return existingIncident;

  const timelinePlan = await generateIncidentTimelinePlan({
    incident: {
      title: log.errorName || "High severity runtime error",
      description: log.aiReport?.analysis || log.errorMessage,
      severity: log.aiReport?.severity,
    },
    log,
  });

  const incident = await Incidents.create({
    projectId: log.projectId,
    owner: log.owner,
    sourceLog: log._id,
    title: `${log.errorName || "Runtime error"}: ${log.errorMessage}`.slice(0, 180),
    description:
      log.aiReport?.analysis ||
      "CONCH detected a high severity runtime error from the package.",
    severity: log.aiReport?.severity,
    status: "OPEN",
    publicStatus: getPublicStatusForSeverity(log.aiReport?.severity),
    timelinePlan,
    timeline: [
      {
        type: "CREATED",
        message: "AI opened incident from captured error",
        author: null,
        metadata: { logId: log._id, severity: log.aiReport?.severity },
      },
      {
        type: "UPDATE_POSTED",
        message: "Manager notification queued",
        author: null,
        metadata: { channel: "email/dashboard" },
      },
    ],
  });

  const manager = await Users.findById(log.owner).select("email name").lean();
  if (manager?.email) {
    try {
      await sendEmail(
        manager.email,
        "CONCH high severity incident opened",
        `<p>Hello ${manager.name || "Manager"},</p>
        <p>CONCH detected a high severity error and opened an incident.</p>
        <p><strong>${log.errorName || "Runtime error"}:</strong> ${log.errorMessage}</p>
        <p>Please assign a team and review the AI timeline in your dashboard.</p>`,
      );
    } catch (error) {
      console.error("Manager notification failed:", error.message);
    }
  }

  return incident.toObject();
};

export const queueLogAnalysis = (logId) => {
  if (process.env.AI_ANALYSIS_ENABLED === "false") return;

  setImmediate(() => {
    analyzeAndUpdateLog(logId).catch((error) => {
      console.error("AI analysis worker crashed:", error.message);
    });
  });
};
