import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "CREATED",
        "STATUS_CHANGED",
        "RESPONDER_ASSIGNED",
        "UPDATE_POSTED",
        "POSTMORTEM_GENERATED",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } },
);

const updateSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: { createdAt: true, updatedAt: false } },
);

const postmortemSchema = new mongoose.Schema(
  {
    summary: { type: String, default: "" },
    rootCause: { type: String, default: "" },
    resolution: { type: String, default: "" },
    prevention: { type: [String], default: [] },
    impact: { type: String, default: "" },
    generatedBy: {
      type: String,
      enum: ["AI", "MANUAL"],
      default: "AI",
    },
    generatedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const timelinePlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    owner: { type: String, trim: true, default: "Unassigned" },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    dueInMinutes: { type: Number, default: 30 },
  },
  { _id: true, timestamps: { createdAt: true, updatedAt: false } },
);

const incidentSchema = new mongoose.Schema(
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
    sourceLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Log",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
      index: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"],
      default: "OPEN",
      index: true,
    },
    publicStatus: {
      type: String,
      enum: ["OPERATIONAL", "DEGRADED", "PARTIAL_OUTAGE", "MAJOR_OUTAGE"],
      default: "DEGRADED",
    },
    responders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    timelinePlan: {
      type: [timelinePlanSchema],
      default: [],
    },
    managerNotes: {
      type: String,
      trim: true,
      default: "",
    },
    updates: {
      type: [updateSchema],
      default: [],
    },
    timeline: {
      type: [timelineSchema],
      default: [],
    },
    postmortem: {
      type: postmortemSchema,
      default: null,
    },
    resolvedAt: {
      type: Date,
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

const Incidents = mongoose.model("Incident", incidentSchema, "incidents");

export { Incidents };
export default Incidents;
