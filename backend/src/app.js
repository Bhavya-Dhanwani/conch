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
app.set("trust proxy", 1);
app.use(express.json());
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

  return cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })(req, res, next);
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
