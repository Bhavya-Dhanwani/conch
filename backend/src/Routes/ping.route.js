import express from "express";

const pingRouter = express.Router();

const handlePing = (req, res) =>
  res.status(200).json({
    success: true,
    message: "pong",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });

pingRouter.get("/", handlePing);
pingRouter.post("/", handlePing);

export default pingRouter;
