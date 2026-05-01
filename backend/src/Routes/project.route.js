import express from "express";

import * as controller from "../Controllers/project.controller.js";
import { isAuthenticated, restrictTo } from "../Middlewares/auth.middleware.js";

const projectRouter = express.Router();

projectRouter.use(isAuthenticated);

projectRouter
  .route("/")
  .post(restrictTo("MANAGER"), controller.createProject)
  .get(controller.getProjects);

projectRouter.get("/:projectId", controller.getProject);

export default projectRouter;
