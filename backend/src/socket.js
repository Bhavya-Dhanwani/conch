import { Server } from "socket.io";

import Users from "./Models/user.model.js";
import { createProjectMessage, createTeamMessage } from "./Services/chat.service.js";
import { getProjectForUser } from "./Services/project.service.js";
import { getTeamForUser } from "./Services/team.service.js";
import { verifyToken } from "./Utilities/jwtokenGenerator.js";

const getTokenFromSocket = (socket) => {
  const authToken = socket.handshake.auth?.token;
  const bearerToken = socket.handshake.headers?.authorization?.replace(
    "Bearer ",
    "",
  );
  const cookieToken = socket.handshake.headers?.cookie
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="))
    ?.replace("token=", "");

  return authToken || bearerToken || cookieToken;
};

const projectRoom = (projectId) => `project:${projectId}:chat`;
const teamRoom = (teamId) => `team:${teamId}:chat`;

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = getTokenFromSocket(socket);

      if (!token) {
        return next(new Error("Socket authentication token is required"));
      }

      const { data } = verifyToken(token);
      const user = await Users.findById(data.userId).lean();

      if (!user) {
        return next(new Error("Socket user not found"));
      }

      socket.user = user;
      return next();
    } catch {
      return next(new Error("Invalid socket authentication token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("project_chat:join", async ({ projectId } = {}, callback) => {
      try {
        await getProjectForUser(socket.user, projectId);
        socket.join(projectRoom(projectId));

        callback?.({
          success: true,
          room: projectRoom(projectId),
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });

    socket.on("project_chat:leave", ({ projectId } = {}, callback) => {
      socket.leave(projectRoom(projectId));
      callback?.({ success: true });
    });

    socket.on("project_chat:message", async ({ projectId, message } = {}, callback) => {
      try {
        const chatMessage = await createProjectMessage(
          socket.user,
          projectId,
          message,
        );

        io.to(projectRoom(projectId)).emit("project_chat:new_message", {
          projectId,
          message: chatMessage,
        });

        callback?.({
          success: true,
          message: chatMessage,
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });

    socket.on("team_chat:join", async ({ teamId } = {}, callback) => {
      try {
        await getTeamForUser(socket.user, teamId);
        socket.join(teamRoom(teamId));

        callback?.({
          success: true,
          room: teamRoom(teamId),
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });

    socket.on("team_chat:leave", ({ teamId } = {}, callback) => {
      socket.leave(teamRoom(teamId));
      callback?.({ success: true });
    });

    socket.on("team_chat:message", async ({ teamId, message } = {}, callback) => {
      try {
        const chatMessage = await createTeamMessage(socket.user, teamId, message);

        io.to(teamRoom(teamId)).emit("team_chat:new_message", {
          teamId,
          message: chatMessage,
        });

        callback?.({
          success: true,
          message: chatMessage,
        });
      } catch (error) {
        callback?.({
          success: false,
          message: error.message,
        });
      }
    });
  });

  return io;
};
