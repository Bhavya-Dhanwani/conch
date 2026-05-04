import mongoose from "mongoose";

const deploymentRunSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["QUEUED", "BUILDING", "READY", "FAILED"],
      default: "QUEUED",
    },
    commitSha: {
      type: String,
      trim: true,
      default: "",
    },
    deploymentUrl: {
      type: String,
      trim: true,
      default: "",
    },
    logs: {
      type: [String],
      default: [],
    },
    queuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const deploymentEnvSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    value: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },
    environment: {
      type: String,
      enum: ["production", "preview", "all"],
      default: "all",
    },
    isSecret: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const deploymentProjectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    framework: {
      type: String,
      enum: ["nextjs", "react", "node", "vanilla"],
      required: true,
      index: true,
    },
    detectedLanguage: {
      type: String,
      trim: true,
      default: "",
    },
    detectedFramework: {
      type: String,
      trim: true,
      default: "",
    },
    repository: {
      id: {
        type: Number,
        required: true,
      },
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      htmlUrl: {
        type: String,
        trim: true,
        default: "",
      },
      cloneUrl: {
        type: String,
        trim: true,
        default: "",
      },
      defaultBranch: {
        type: String,
        trim: true,
        default: "main",
      },
      private: {
        type: Boolean,
        default: false,
      },
    },
    rootDirectory: {
      type: String,
      trim: true,
      default: ".",
    },
    packageManager: {
      type: String,
      enum: ["npm", "pnpm", "yarn", "bun", "none"],
      default: "npm",
    },
    installCommand: {
      type: String,
      trim: true,
      default: "npm install",
    },
    buildCommand: {
      type: String,
      trim: true,
      default: "npm run build",
    },
    startCommand: {
      type: String,
      trim: true,
      default: "",
    },
    outputDirectory: {
      type: String,
      trim: true,
      default: "",
    },
    environment: {
      type: String,
      enum: ["production", "preview"],
      default: "production",
    },
    environmentVariables: {
      type: [deploymentEnvSchema],
      default: [],
    },
    defaultSubdomain: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    defaultDomain: {
      type: String,
      trim: true,
      default: "",
    },
    customDomain: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    liveUrl: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["READY", "QUEUED", "BUILDING", "FAILED"],
      default: "READY",
      index: true,
    },
    deployments: {
      type: [deploymentRunSchema],
      default: [],
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

deploymentProjectSchema.index({ owner: 1, "repository.fullName": 1 });

const DeploymentProjects = mongoose.model(
  "DeploymentProject",
  deploymentProjectSchema,
  "deployment_projects",
);

export { DeploymentProjects };
export default DeploymentProjects;
