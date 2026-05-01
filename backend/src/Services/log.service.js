import mongoose from "mongoose";

import Logs from "../Models/log.model.js";
import { AppError } from "../Utilities/appError.js";
import { getProjectForUser } from "./project.service.js";

export const getProjectLogs = async (user, projectId) => {
  await getProjectForUser(user, projectId);

  return Logs.find({ projectId })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
};

export const getLogById = async (user, logId) => {
  if (!mongoose.isValidObjectId(logId)) {
    throw new AppError("Invalid log id", 400);
  }

  const log = await Logs.findById(logId).lean();
  if (!log) {
    throw new AppError("Log not found", 404);
  }

  await getProjectForUser(user, log.projectId);

  return log;
};
