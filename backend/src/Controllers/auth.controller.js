import { catchAsync } from "../Utilities/catchAsync.js";
import { clearAuthCookie, sendAuthCookie } from "../Utilities/authCookies.js";

import * as authServices from "../Services/auth.service.js";

export const signup = catchAsync(async (req, res) => {
  const { user, token } = await authServices.signupManager(req.body);

  sendAuthCookie(res, token);

  return res.status(201).json({
    success: true,
    message: "Manager account created successfully",
    user,
  });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await authServices.loginUser(req.body);

  sendAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: `Welcome back, ${user.name}`,
    user,
  });
});

export const githubAuthorize = catchAsync(async (req, res) => {
  return res.redirect(authServices.getGithubAuthorizationUrl());
});

export const githubCallback = catchAsync(async (req, res) => {
  const { user, token } = await authServices.loginWithGithub(req.query.code);

  sendAuthCookie(res, token);

  return res.redirect(`${authServices.getClientRedirectUrl()}/`);
});

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User Fetched Successfully",
    user: req.user,
  });
});

export const logout = catchAsync(async (req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
});

export const createEmployee = catchAsync(async (req, res) => {
  const employee = await authServices.createEmployee(req.user, req.body);

  return res.status(201).json({
    success: true,
    message: "Employee created successfully",
    employee,
  });
});

export const updateEmployee = catchAsync(async (req, res) => {
  const employee = await authServices.updateEmployee(
    req.user,
    req.params.employeeId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    employee,
  });
});

export const deleteEmployee = catchAsync(async (req, res) => {
  const employee = await authServices.deleteEmployee(
    req.user,
    req.params.employeeId,
  );

  return res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
    employee,
  });
});
