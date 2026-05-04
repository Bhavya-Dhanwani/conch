import mongoose from "mongoose";

import Teams from "../Models/team.model.js";
import Users from "../Models/user.model.js";
import { AppError } from "../Utilities/appError.js";

const normalizeIdList = (ids = []) => {
  const list = Array.isArray(ids) ? ids : [ids];
  return [...new Set(list.filter(Boolean).map((id) => String(id)))];
};

const validateObjectId = (value, label) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
};

const getManagerId = (user) => {
  if (user.role === "MANAGER") return user._id;
  return user.managerId;
};

export const validateManagerTeamMembers = async (managerId, memberIds = []) => {
  const ids = normalizeIdList(memberIds);
  if (!ids.length) return [];

  ids.forEach((id) => validateObjectId(id, "member id"));

  const users = await Users.find({
    _id: { $in: ids },
    role: "EMPLOYEE",
    managerId,
  })
    .select("_id")
    .lean();

  if (users.length !== ids.length) {
    throw new AppError("One or more members are not employees for this manager", 400);
  }

  return users.map((member) => member._id);
};

const populateTeam = (query) => query.populate("members", "name email role work");

export const createTeam = async (user, payload = {}) => {
  const owner = getManagerId(user);
  const name = payload.name?.trim();

  if (!name) {
    throw new AppError("Team name is required", 400);
  }

  const members = await validateManagerTeamMembers(owner, payload.members);

  const team = await Teams.create({
    owner,
    name,
    focus: payload.focus || "",
    members,
  });

  return populateTeam(Teams.findById(team._id)).lean();
};

export const getTeams = async (user) => {
  const owner = getManagerId(user);
  return populateTeam(Teams.find({ owner }).sort({ createdAt: -1 })).lean();
};

export const getMyTeams = async (user) => {
  if (user.role === "MANAGER") {
    return getTeams(user);
  }

  if (!user.managerId) {
    throw new AppError("Employee is not linked with any manager", 403);
  }

  return populateTeam(
    Teams.find({
      owner: user.managerId,
      members: user._id,
    }).sort({ createdAt: -1 }),
  ).lean();
};

export const getTeamForUser = async (user, teamId) => {
  validateObjectId(teamId, "team id");

  const owner = getManagerId(user);
  const filter = user.role === "MANAGER"
    ? { _id: teamId, owner }
    : { _id: teamId, owner, members: user._id };

  const team = await populateTeam(Teams.findOne(filter)).lean();

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  return team;
};

export const updateTeam = async (user, teamId, payload = {}) => {
  const owner = getManagerId(user);
  validateObjectId(teamId, "team id");

  const updatePayload = {};
  if (payload.name !== undefined) updatePayload.name = payload.name.trim();
  if (payload.focus !== undefined) updatePayload.focus = payload.focus;
  if (payload.members !== undefined) {
    updatePayload.members = await validateManagerTeamMembers(owner, payload.members);
  }

  if (!Object.keys(updatePayload).length) {
    throw new AppError("At least one editable team field is required", 400);
  }

  const team = await Teams.findOneAndUpdate(
    { _id: teamId, owner },
    { $set: updatePayload },
    { returnDocument: "after", runValidators: true },
  );

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  return populateTeam(Teams.findById(team._id)).lean();
};

export const deleteTeam = async (user, teamId) => {
  const owner = getManagerId(user);
  validateObjectId(teamId, "team id");

  const team = await Teams.findOneAndDelete({ _id: teamId, owner });
  if (!team) {
    throw new AppError("Team not found", 404);
  }

  return team.toObject();
};
