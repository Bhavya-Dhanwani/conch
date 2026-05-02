import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import allRoutes from "./Routes/index.js";
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
];
const configuredClientOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedClientOrigins = [...new Set([...defaultClientOrigins, ...configuredClientOrigins])];

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedClientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use("/api", allRoutes);

app.use(globalErrorHandler);

export default app;
