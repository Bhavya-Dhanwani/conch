import crypto from "crypto";
import mongoose from "mongoose";

import Projects from "../Models/project.model.js";
import { AppError } from "../Utilities/appError.js";

const getManagerId = (user) => {
  if (user.role === "MANAGER") return user._id;
  return user.managerId;
};

const generateApiKey = () => `conch_${crypto.randomBytes(24).toString("hex")}`;

export const createProject = async (user, { name } = {}) => {
  if (user.role !== "MANAGER") {
    throw new AppError("Only managers can create projects", 403);
  }

  if (!name) {
    throw new AppError("Project name is required", 400);
  }

  const project = await Projects.create({
    name,
    apiKey: generateApiKey(),
    owner: user._id,
  });

  return project.toObject();
};

export const getProjects = async (user) => {
  const owner = getManagerId(user);
  if (!owner) {
    throw new AppError("Employee is not linked with any manager", 403);
  }

  return Projects.find({ owner, isActive: true })
    .select("+apiKey")
    .sort({ createdAt: -1 })
    .lean();
};

export const getProjectForUser = async (user, projectId) => {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  const owner = getManagerId(user);
  if (!owner) {
    throw new AppError("Employee is not linked with any manager", 403);
  }

  const project = await Projects.findOne({
    _id: projectId,
    owner,
    isActive: true,
  })
    .select("+apiKey")
    .lean();

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};
