import express from "express";

import * as controller from "../Controllers/ingest.controller.js";

const ingestRouter = express.Router();

ingestRouter.post("/event", controller.ingestEvent);

export default ingestRouter;
