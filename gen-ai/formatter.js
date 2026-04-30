export function formatResponse(text) {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return {
      raw: text,
      error: "Failed to parse structured response",
    };
  }
}