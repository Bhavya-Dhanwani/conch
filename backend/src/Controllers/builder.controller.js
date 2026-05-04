import { catchAsync } from "../Utilities/catchAsync.js";
import * as builderServices from "../Services/builder.service.js";

export const generateWebsite = catchAsync(async (req, res) => {
  const result = await builderServices.generateWebsiteDraft(req.body);

  return res.status(200).json({
    success: true,
    ...result,
  });
});

export const uploadLogo = catchAsync(async (req, res) => {
  const logo = await builderServices.uploadBuilderLogo(req.file);

  return res.status(201).json({
    success: true,
    ...logo,
  });
});
