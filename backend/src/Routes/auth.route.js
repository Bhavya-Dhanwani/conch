import express from "express";
import * as controller from "../Controllers/auth.controller.js";
import { isAuthenticated, restrictTo } from "../Middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter
  .post("/signup", controller.signup)
  .post("/login", controller.login)
  .get("/github", controller.githubAuthorize)
  .get("/github/connect", isAuthenticated, controller.githubConnectAuthorize)
  .get("/github/callback", controller.githubCallback)
  .get("/me", isAuthenticated, controller.getMe)
  .post("/logout", controller.logout);

authRouter
  .post(
    "/employees",
    isAuthenticated,
    restrictTo("MANAGER"),
    controller.createEmployee,
  )
  .get(
    "/employees",
    isAuthenticated,
    restrictTo("MANAGER"),
    controller.getEmployees,
  )
  .patch(
    "/employees/:employeeId",
    isAuthenticated,
    restrictTo("MANAGER"),
    controller.updateEmployee,
  )
  .delete(
    "/employees/:employeeId",
    isAuthenticated,
    restrictTo("MANAGER"),
    controller.deleteEmployee,
  );

export default authRouter;
