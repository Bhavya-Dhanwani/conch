import { catchAsync } from "../Utilities/catchAsync.js";
import * as deploymentServices from "../Services/deployment.service.js";

export const listGithubRepositories = catchAsync(async (req, res) => {
  const repositories = await deploymentServices.listGithubRepositories(req.user);

  return res.status(200).json({
    success: true,
    message: "GitHub repositories fetched successfully",
    repositories,
  });
});

export const listDeploymentProjects = catchAsync(async (req, res) => {
  const projects = await deploymentServices.listDeploymentProjects(req.user);

  return res.status(200).json({
    success: true,
    message: "Deployment projects fetched successfully",
    projects,
  });
});

export const getDeploymentProject = catchAsync(async (req, res) => {
  const project = await deploymentServices.getDeploymentProject(req.user, req.params.projectId);

  return res.status(200).json({
    success: true,
    message: "Deployment project fetched successfully",
    project,
  });
});

export const deleteDeploymentProject = catchAsync(async (req, res) => {
  await deploymentServices.deleteDeploymentProject(req.user, req.params.projectId);

  return res.status(200).json({
    success: true,
    message: "Deployment project removed successfully",
  });
});

export const updateDeploymentEnvironmentVariables = catchAsync(async (req, res) => {
  const project = await deploymentServices.updateDeploymentEnvironmentVariables(
    req.user,
    req.params.projectId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Deployment environment variables updated successfully",
    project,
  });
});

export const createDeploymentProject = catchAsync(async (req, res) => {
  const project = await deploymentServices.createDeploymentProject(req.user, req.body);

  return res.status(201).json({
    success: true,
    message: "Deployment project created successfully",
    project,
  });
});

export const queueDeployment = catchAsync(async (req, res) => {
  const project = await deploymentServices.queueDeployment(req.user, req.params.projectId);

  return res.status(200).json({
    success: true,
    message: "Deployment queued successfully",
    project,
  });
});

export const listDeploymentLogs = catchAsync(async (req, res) => {
  const logs = await deploymentServices.listDeploymentLogs(req.user, req.params.projectId, {
    limit: req.query.limit,
  });

  return res.status(200).json({
    success: true,
    message: "Deployment logs fetched successfully",
    logs,
  });
});

export const createWebsiteLog = catchAsync(async (req, res) => {
  const log = await deploymentServices.createWebsiteLog(req.user, req.params.projectId, req.body);

  return res.status(201).json({
    success: true,
    message: "Deployment log created successfully",
    log,
  });
});
