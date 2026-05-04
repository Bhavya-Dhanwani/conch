import express from "express";

import * as controller from "../Controllers/team.controller.js";
import { isAuthenticated, restrictTo } from "../Middlewares/auth.middleware.js";

const teamRouter = express.Router();

teamRouter.use(isAuthenticated);
teamRouter.get("/mine", controller.getMyTeams);

teamRouter.use(restrictTo("MANAGER"));

teamRouter.post("/", controller.createTeam);
teamRouter.get("/", controller.getTeams);
teamRouter.patch("/:teamId", controller.updateTeam);
teamRouter.delete("/:teamId", controller.deleteTeam);

export default teamRouter;
