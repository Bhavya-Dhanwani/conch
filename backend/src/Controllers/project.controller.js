import { catchAsync } from "../Utilities/catchAsync.js";
import * as projectServices from "../Services/project.service.js";

export const createProject = catchAsync(async (req, res) => {
  const project = await projectServices.createProject(req.user, req.body);

  return res.status(201).json({
    success: true,
    message: "Project created successfully",
    project,
  });
});

export const getProjects = catchAsync(async (req, res) => {
  const projects = await projectServices.getProjects(req.user);

  return res.status(200).json({
    success: true,
    message: "Projects fetched successfully",
    projects,
  });
});

export const getProject = catchAsync(async (req, res) => {
  const project = await projectServices.getProjectForUser(
    req.user,
    req.params.projectId,
  );

  return res.status(200).json({
    success: true,
    message: "Project fetched successfully",
    project,
  });
});
