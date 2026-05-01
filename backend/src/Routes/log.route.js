import express from "express";

import * as controller from "../Controllers/log.controller.js";
import { isAuthenticated } from "../Middlewares/auth.middleware.js";

const logRouter = express.Router();

logRouter.use(isAuthenticated);

logRouter.get("/project/:projectId", controller.getProjectLogs);
logRouter.get("/:logId", controller.getLogById);

export default logRouter;
