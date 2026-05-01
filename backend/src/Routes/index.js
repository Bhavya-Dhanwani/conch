import express from "express";
import authRouter from "./auth.route.js";

const router = express.Router();

// Auth routes are available as /api/signup and /api/auth/signup.
router.use("/", authRouter);
router.use("/auth", authRouter);

export default router;
