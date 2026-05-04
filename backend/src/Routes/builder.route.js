import express from "express";
import multer from "multer";

import * as controller from "../Controllers/builder.controller.js";

const builderRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (/^image\/(png|jpe?g|webp|svg\+xml)$/.test(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new Error("Upload a PNG, JPG, WEBP, or SVG logo."));
  },
});

const uploadLogo = (req, res, next) => {
  upload.single("logo")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Logo upload failed",
      });
    }

    return next();
  });
};

builderRouter.post("/generate", controller.generateWebsite);
builderRouter.post("/logo", uploadLogo, controller.uploadLogo);

export default builderRouter;
