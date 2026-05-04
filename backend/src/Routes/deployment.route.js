import express from "express";

import * as controller from "../Controllers/deployment.controller.js";
import { isAuthenticated } from "../Middlewares/auth.middleware.js";

const deploymentRouter = express.Router();

deploymentRouter.use(isAuthenticated);

deploymentRouter.get("/github/repos", controller.listGithubRepositories);
deploymentRouter
  .route("/projects")
  .get(controller.listDeploymentProjects)
  .post(controller.createDeploymentProject);
deploymentRouter
  .route("/projects/:projectId")
  .get(controller.getDeploymentProject)
  .delete(controller.deleteDeploymentProject);
deploymentRouter.patch(
  "/projects/:projectId/environment-variables",
  controller.updateDeploymentEnvironmentVariables,
);
deploymentRouter
  .route("/projects/:projectId/logs")
  .get(controller.listDeploymentLogs)
  .post(controller.createWebsiteLog);
deploymentRouter.post("/projects/:projectId/deploy", controller.queueDeployment);

export default deploymentRouter;
