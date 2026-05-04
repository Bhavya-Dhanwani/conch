import ChatMessages from "../Models/chatMessage.model.js";
import TeamChatMessages from "../Models/teamChatMessage.model.js";
import { AppError } from "../Utilities/appError.js";
import { getProjectForUser } from "./project.service.js";
import { getTeamForUser } from "./team.service.js";

const MAX_MESSAGE_LENGTH = 4000;

const normalizeMessage = (message) => {
  const normalized = String(message || "").trim();

  if (!normalized) {
    throw new AppError("Chat message is required", 400);
  }

  if (normalized.length > MAX_MESSAGE_LENGTH) {
    throw new AppError(`Chat message cannot exceed ${MAX_MESSAGE_LENGTH} characters`, 400);
  }

  return normalized;
};

export const getProjectMessages = async (user, projectId, options = {}) => {
  await getProjectForUser(user, projectId);

  const limit = Math.min(Number(options.limit) || 50, 100);
  const before = options.before ? new Date(options.before) : null;
  const filter = { projectId };

  if (before && !Number.isNaN(before.getTime())) {
    filter.createdAt = { $lt: before };
  }

  const messages = await ChatMessages.find(filter)
    .populate("sender", "name email role work")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return messages.reverse();
};

export const createProjectMessage = async (user, projectId, message) => {
  const project = await getProjectForUser(user, projectId);
  const normalizedMessage = normalizeMessage(message);

  const chatMessage = await ChatMessages.create({
    projectId: project._id,
    owner: project.owner,
    sender: user._id,
    message: normalizedMessage,
  });

  return ChatMessages.findById(chatMessage._id)
    .populate("sender", "name email role work")
    .lean();
};

export const getTeamMessages = async (user, teamId, options = {}) => {
  await getTeamForUser(user, teamId);

  const limit = Math.min(Number(options.limit) || 50, 100);
  const before = options.before ? new Date(options.before) : null;
  const filter = { teamId };

  if (before && !Number.isNaN(before.getTime())) {
    filter.createdAt = { $lt: before };
  }

  const messages = await TeamChatMessages.find(filter)
    .populate("sender", "name email role work")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return messages.reverse();
};

export const createTeamMessage = async (user, teamId, message) => {
  const team = await getTeamForUser(user, teamId);
  const normalizedMessage = normalizeMessage(message);

  const chatMessage = await TeamChatMessages.create({
    teamId: team._id,
    owner: team.owner,
    sender: user._id,
    message: normalizedMessage,
  });

  return TeamChatMessages.findById(chatMessage._id)
    .populate("sender", "name email role work")
    .lean();
};
