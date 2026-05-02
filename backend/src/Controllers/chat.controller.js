import { catchAsync } from "../Utilities/catchAsync.js";
import * as chatServices from "../Services/chat.service.js";

export const getProjectMessages = catchAsync(async (req, res) => {
  const messages = await chatServices.getProjectMessages(
    req.user,
    req.params.projectId,
    {
      limit: req.query.limit,
      before: req.query.before,
    },
  );

  return res.status(200).json({
    success: true,
    message: "Project chat messages fetched successfully",
    messages,
  });
});

export const createProjectMessage = catchAsync(async (req, res) => {
  const chatMessage = await chatServices.createProjectMessage(
    req.user,
    req.params.projectId,
    req.body.message,
  );

  return res.status(201).json({
    success: true,
    message: "Project chat message sent successfully",
    chatMessage,
  });
});
