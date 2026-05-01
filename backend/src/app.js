import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import allRoutes from "./Routes/index.js";
import globalErrorHandler from "./Middlewares/globalError.middleware.js";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api", allRoutes);

app.use(globalErrorHandler);

export default app;
