import { catchAsync } from "../Utilities/catchAsync.js";
import * as teamServices from "../Services/team.service.js";

export const createTeam = catchAsync(async (req, res) => {
  const team = await teamServices.createTeam(req.user, req.body);

  return res.status(201).json({
    success: true,
    message: "Team created successfully",
    team,
  });
});

export const getTeams = catchAsync(async (req, res) => {
  const teams = await teamServices.getTeams(req.user);

  return res.status(200).json({
    success: true,
    message: "Teams fetched successfully",
    teams,
  });
});

export const getMyTeams = catchAsync(async (req, res) => {
  const teams = await teamServices.getMyTeams(req.user);

  return res.status(200).json({
    success: true,
    message: "Teams fetched successfully",
    teams,
  });
});

export const updateTeam = catchAsync(async (req, res) => {
  const team = await teamServices.updateTeam(req.user, req.params.teamId, req.body);

  return res.status(200).json({
    success: true,
    message: "Team updated successfully",
    team,
  });
});

export const deleteTeam = catchAsync(async (req, res) => {
  const team = await teamServices.deleteTeam(req.user, req.params.teamId);

  return res.status(200).json({
    success: true,
    message: "Team deleted successfully",
    team,
  });
});
