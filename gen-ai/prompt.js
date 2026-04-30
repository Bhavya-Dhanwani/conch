export function buildPrompt({ logs, error, code, hints }) {
  return `
You are an expert incident response AI used in production systems.

Analyze deeply:

ERROR:
${error}

LOGS:
${logs}

CODE:
${code}

HINTS:
${hints}

Return STRICT JSON:

{
  "root_cause": "",
  "where": "",
  "when": "",
  "explanation": "",
  "severity": "Low | Medium | High | Critical",
  "fix_steps": ["step1", "step2"],
  "corrected_code": "",
  "prevention": ["tip1", "tip2"],
  "confidence": "0-100%"
}
`;
}