import express from "express";

import * as controller from "../Controllers/incident.controller.js";
import { isAuthenticated } from "../Middlewares/auth.middleware.js";

const incidentRouter = express.Router();

incidentRouter.use(isAuthenticated);

incidentRouter.post("/", controller.createIncident);
incidentRouter.get("/project/:projectId", controller.getProjectIncidents);
incidentRouter.get("/:incidentId", controller.getIncidentById);
incidentRouter.patch("/:incidentId", controller.updateIncident);
incidentRouter.post("/:incidentId/responders", controller.assignResponders);
incidentRouter.post("/:incidentId/updates", controller.addIncidentUpdate);
incidentRouter.post("/:incidentId/postmortem", controller.generatePostmortem);

export default incidentRouter;
