import { handleIngestError } from "@/controllers/error.controllers";
import wrapAsync from "@/utils/wrapAsync.util";

export const POST = wrapAsync(handleIngestError);
