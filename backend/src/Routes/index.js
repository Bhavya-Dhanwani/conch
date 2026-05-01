import express from "express";
import authRouter from "./auth.route.js";
import projectRouter from "./project.route.js";
import logRouter from "./log.route.js";
import ingestRouter from "./ingest.route.js";

const router = express.Router();

// Auth routes are available as /api/signup and /api/auth/signup.
router.use("/", authRouter);
router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/logs", logRouter);
router.use("/ingest", ingestRouter);

export default router;
