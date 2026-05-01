import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const minutes = (value) => value * 60 * 1000;

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildLimitMessage = (message) => ({
  success: false,
  message,
});

const getApiKeyOrIp = (req) => {
  return req.get("X-API-KEY") || req.body?.apiKey || ipKeyGenerator(req.ip);
};

export const generalApiLimiter = rateLimit({
  windowMs: minutes(toPositiveNumber(process.env.RATE_LIMIT_WINDOW_MINUTES, 15)),
  limit: toPositiveNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 600),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: buildLimitMessage("Too many requests. Please try again later."),
});

export const authLimiter = rateLimit({
  windowMs: minutes(toPositiveNumber(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES, 15)),
  limit: toPositiveNumber(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS, 30),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: buildLimitMessage("Too many auth attempts. Please try again later."),
});

export const ingestLimiter = rateLimit({
  windowMs: minutes(toPositiveNumber(process.env.INGEST_RATE_LIMIT_WINDOW_MINUTES, 1)),
  limit: toPositiveNumber(process.env.INGEST_RATE_LIMIT_MAX_REQUESTS, 120),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: getApiKeyOrIp,
  message: buildLimitMessage("Too many error events. Please slow down."),
});

export const publicStatusLimiter = rateLimit({
  windowMs: minutes(toPositiveNumber(process.env.STATUS_RATE_LIMIT_WINDOW_MINUTES, 1)),
  limit: toPositiveNumber(process.env.STATUS_RATE_LIMIT_MAX_REQUESTS, 120),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: buildLimitMessage("Too many status requests. Please try again later."),
});
