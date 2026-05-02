import express from "express";

import * as controller from "../Controllers/incident.controller.js";

const statusRouter = express.Router();

statusRouter.get("/public/projects/:projectId", controller.getPublicProjectStatus);

export default statusRouter;
