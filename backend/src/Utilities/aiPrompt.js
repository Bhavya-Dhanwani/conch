export const analyzeInput = ({ logs = "", error = "", code = "" } = {}) => {
  const hints = [];
  const normalizedError = String(error).toLowerCase();
  const normalizedLogs = String(logs).toLowerCase();
  const normalizedCode = String(code);

  if (normalizedError.includes("undefined") || normalizedError.includes("null")) {
    hints.push("Possible null or undefined access issue");
  }

  if (normalizedError.includes("timeout") || normalizedLogs.includes("timeout")) {
    hints.push("Likely network, API, or database latency issue");
  }

  if (normalizedError.includes("mongo") || normalizedLogs.includes("mongo")) {
    hints.push("Possible MongoDB connection or query issue");
  }

  if (normalizedError.includes("crash") || normalizedLogs.includes("crash")) {
    hints.push("Unhandled exception may be crashing the runtime");
  }

  if (normalizedCode.includes("toUpperCase")) {
    hints.push("String method may be used without a null check");
  }

  if (normalizedLogs.includes("retry")) {
    hints.push("System retried before failing");
  }

  return hints.join(", ") || "No deterministic hints found";
};

export const buildPrompt = ({ logs = "", error = "", code = "", hints = "" }) => `
You are a senior production debugger writing a short post-mortem report.

Analyze this runtime error and return only valid JSON. Do not wrap the JSON in markdown.

ERROR:
${error}

LOGS AND STACK TRACE:
${logs}

RELATED CODE IF PROVIDED:
${code || "Not provided"}

DETERMINISTIC HINTS:
${hints}

Return this exact JSON shape:
{
  "root_cause": "",
  "where": "",
  "when": "",
  "explanation": "",
  "severity": "LOW | MEDIUM | HIGH",
  "fix_steps": ["step1", "step2"],
  "corrected_code": "",
  "prevention": ["tip1", "tip2"],
  "confidence": "0-100%"
}
`;

export const parseAIResponse = (text = "") => {
  const clean = String(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    const jsonStart = clean.indexOf("{");
    const jsonEnd = clean.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error("AI response did not contain valid JSON");
    }

    return JSON.parse(clean.slice(jsonStart, jsonEnd + 1));
  }
};
