import { Server } from "socket.io";

import Users from "./Models/user.model.js";
import { createProjectMessage } from "./Services/chat.service.js";
import { getProjectForUser } from "./Services/project.service.js";
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

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
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
  });

  return io;
};
