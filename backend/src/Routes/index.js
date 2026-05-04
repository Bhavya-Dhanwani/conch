import express from "express";
import authRouter from "./auth.route.js";
import projectRouter from "./project.route.js";
import logRouter from "./log.route.js";
import ingestRouter from "./ingest.route.js";
import incidentRouter from "./incident.route.js";
import statusRouter from "./status.route.js";
import chatRouter from "./chat.route.js";
import teamRouter from "./team.route.js";
import builderRouter from "./builder.route.js";
import ecommerceRouter from "./ecommerce.route.js";
import deploymentRouter from "./deployment.route.js";

const router = express.Router();

// Auth routes are available as /api/signup and /api/auth/signup.
router.use("/", authRouter);
router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/logs", logRouter);
router.use("/ingest", ingestRouter);
router.use("/incidents", incidentRouter);
router.use("/status", statusRouter);
router.use("/chat", chatRouter);
router.use("/teams", teamRouter);
router.use("/builder", builderRouter);
router.use("/ecommerce", ecommerceRouter);
router.use("/deployments", deploymentRouter);

export default router;
