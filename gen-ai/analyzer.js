export function analyzeInput({ logs, error, code }) {
  let hints = [];

  const err = error.toLowerCase();

  if (err.includes("undefined")) {
    hints.push("Possible null/undefined access issue");
  }

  if (err.includes("timeout")) {
    hints.push("Likely network or database latency issue");
  }

  if (err.includes("mongo")) {
    hints.push("MongoDB connection issue");
  }

  if (err.includes("crash")) {
    hints.push("Unhandled exception crash");
  }

  if (code.includes("toUpperCase")) {
    hints.push("String method used without null check");
  }

  if (logs.toLowerCase().includes("retry")) {
    hints.push("System retried before failing");
  }

  return hints.join(", ");
}