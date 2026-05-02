import express from "express";

import * as controller from "../Controllers/chat.controller.js";
import { isAuthenticated } from "../Middlewares/auth.middleware.js";

const chatRouter = express.Router();

chatRouter.use(isAuthenticated);

chatRouter
  .route("/projects/:projectId/messages")
  .get(controller.getProjectMessages)
  .post(controller.createProjectMessage);

export default chatRouter;
