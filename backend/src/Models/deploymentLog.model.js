import mongoose from "mongoose";

const deploymentLogSchema = new mongoose.Schema(
  {
    deploymentProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeploymentProject",
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: ["INFO", "WARN", "ERROR"],
      default: "INFO",
      index: true,
    },
    source: {
      type: String,
      enum: ["BUILD", "RUNTIME", "DOMAIN", "SYSTEM"],
      default: "SYSTEM",
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    rootCause: {
      type: String,
      trim: true,
      default: "",
    },
    fileName: {
      type: String,
      trim: true,
      default: "",
    },
    lineNumber: {
      type: Number,
      default: null,
    },
    columnNumber: {
      type: Number,
      default: null,
    },
    probableSolution: {
      type: String,
      trim: true,
      default: "",
    },
    url: {
      type: String,
      trim: true,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

deploymentLogSchema.index({ deploymentProject: 1, createdAt: -1 });

const DeploymentLogs = mongoose.model("DeploymentLog", deploymentLogSchema, "deployment_logs");

export { DeploymentLogs };
export default DeploymentLogs;
