import { catchAsync } from "../Utilities/catchAsync.js";
import * as ingestServices from "../Services/ingest.service.js";

export const ingestEvent = catchAsync(async (req, res) => {
  const apiKey = req.get("X-API-KEY") || req.body.apiKey;
  const log = await ingestServices.ingestEvent(apiKey, req.body);

  return res.status(201).json({
    success: true,
    message: "Event received successfully",
    logId: log._id,
  });
});
