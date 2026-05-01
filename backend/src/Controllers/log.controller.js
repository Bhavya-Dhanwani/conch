import { catchAsync } from "../Utilities/catchAsync.js";
import * as logServices from "../Services/log.service.js";

export const getProjectLogs = catchAsync(async (req, res) => {
  const logs = await logServices.getProjectLogs(req.user, req.params.projectId);

  return res.status(200).json({
    success: true,
    message: "Logs fetched successfully",
    logs,
  });
});

export const getLogById = catchAsync(async (req, res) => {
  const log = await logServices.getLogById(req.user, req.params.logId);

  return res.status(200).json({
    success: true,
    message: "Log fetched successfully",
    log,
  });
});
