import { handleRegister } from "@/controllers/user.controllers";
import wrapAsync from "@/utils/wrapAsync.util";

export const POST = wrapAsync(handleRegister);
