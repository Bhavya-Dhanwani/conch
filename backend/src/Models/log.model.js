import mongoose from "mongoose";

const metadataSchema = new mongoose.Schema(
  {
    browser: { type: String, trim: true, default: "" },
    os: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, default: "" },
    userAgent: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const aiReportSchema = new mongoose.Schema(
  {
    analysis: { type: String, default: "" },
    solution: { type: String, default: "" },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    rootCause: { type: String, default: "" },
    where: { type: String, default: "" },
    when: { type: String, default: "" },
    fixSteps: { type: [String], default: [] },
    correctedCode: { type: String, default: "" },
    prevention: { type: [String], default: [] },
    confidence: { type: String, default: "" },
  },
  { _id: false },
);

const logSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    errorName: {
      type: String,
      trim: true,
      default: "Error",
    },
    errorMessage: {
      type: String,
      required: true,
      trim: true,
    },
    stackTrace: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    codeSnippet: {
      type: String,
      trim: true,
      default: "",
    },
    metadata: {
      type: metadataSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: ["PENDING", "ANALYZED", "FAILED"],
      default: "PENDING",
    },
    aiReport: {
      type: aiReportSchema,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

const Logs = mongoose.model("Log", logSchema, "logs");

export { Logs };
export default Logs;
