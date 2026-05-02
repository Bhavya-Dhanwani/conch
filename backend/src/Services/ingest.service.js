import Projects from "../Models/project.model.js";
import Logs from "../Models/log.model.js";
import { queueLogAnalysis } from "./ai.service.js";
import { AppError } from "../Utilities/appError.js";

const normalizeStackTrace = (stackTrace) => {
  if (!stackTrace) return null;
  if (typeof stackTrace === "string") return stackTrace.slice(0, 12000);
  return stackTrace;
};

const normalizeCodeSnippet = (codeSnippet) => {
  if (!codeSnippet) return "";
  return String(codeSnippet).slice(0, 12000);
};

const normalizeMetadata = (metadata = {}) => ({
  browser: metadata.browser || "",
  os: metadata.os || "",
  url: metadata.url || "",
  userAgent: metadata.userAgent || "",
});

export const ingestEvent = async (apiKey, payload = {}) => {
  if (!apiKey) {
    throw new AppError("X-API-KEY header is required", 401);
  }

  const project = await Projects.findOne({ apiKey, isActive: true }).select(
    "+apiKey",
  );

  if (!project) {
    throw new AppError("Invalid API key", 401);
  }

  const errorMessage =
    payload.errorMessage || payload.message || payload.error?.message;

  if (!errorMessage) {
    throw new AppError("errorMessage is required", 400);
  }

  const log = await Logs.create({
    projectId: project._id,
    owner: project.owner,
    errorName: payload.errorName || payload.name || payload.error?.name,
    errorMessage,
    stackTrace: normalizeStackTrace(
      payload.stackTrace || payload.stack || payload.error?.stack,
    ),
    codeSnippet: normalizeCodeSnippet(
      payload.codeSnippet || payload.code || payload.sourceCode,
    ),
    metadata: normalizeMetadata(payload.metadata),
    status: "PENDING",
  });

  queueLogAnalysis(log._id);

  return log.toObject();
};
