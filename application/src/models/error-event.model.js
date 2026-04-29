import mongoose from "mongoose";

const errorEventSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: ["error", "warning", "info", "fatal"],
      default: "error",
    },
    stack: {
      type: String,
    },
    source: {
      type: String,
      trim: true,
    },
    environment: {
      type: String,
      trim: true,
    },
    release: {
      type: String,
      trim: true,
    },
    appName: {
      type: String,
      trim: true,
    },
    projectKey: {
      type: String,
      trim: true,
      index: true,
    },
    sdk: {
      name: { type: String, trim: true },
      version: { type: String, trim: true },
    },
    tags: {
      type: Map,
      of: String,
      default: {},
    },
    extra: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    url: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    occurredAt: {
      type: Date,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const ErrorEvent =
  mongoose.models.ErrorEvent || mongoose.model("ErrorEvent", errorEventSchema);

export default ErrorEvent;
