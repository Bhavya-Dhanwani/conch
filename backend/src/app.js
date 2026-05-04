import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import allRoutes from "./Routes/index.js";
import {
  authLimiter,
  generalApiLimiter,
  ingestLimiter,
  publicStatusLimiter,
} from "./Middlewares/rateLimit.middleware.js";
import globalErrorHandler from "./Middlewares/globalError.middleware.js";

const app = express();
const defaultClientOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
  "http://localhost:5173",
  "http://conch.bhavyadhanwani.dev",
  "https://conch.bhavyadhanwani.dev",
];
const configuredClientOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedClientOrigins = [...new Set([...defaultClientOrigins, ...configuredClientOrigins])];

const isAllowedOrigin = (origin) => !origin || allowedClientOrigins.includes(origin);

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
};

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "100kb" }));
app.use(cookieParser());

app.use(
  "/api/ingest",
  cors({
    origin: "*",
    credentials: false,
  }),
);

app.use((req, res, next) => {
  if (req.path.startsWith("/api/ingest")) return next();

  return cors(corsOptions)(req, res, next);
});

app.use("/api/ingest", ingestLimiter);
app.use("/api/status", publicStatusLimiter);
app.use(
  ["/api/signup", "/api/login", "/api/auth/signup", "/api/auth/login"],
  authLimiter,
);
app.use("/api", generalApiLimiter);

app.use("/api", allRoutes);

app.use(globalErrorHandler);

export default app;
