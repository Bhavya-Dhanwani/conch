import { verifyToken } from "../Utilities/jwtokenGenerator.js";
import Users from "../Models/user.model.js";
import { AppError } from "../Utilities/appError.js";
import { catchAsync } from "../Utilities/catchAsync.js";

export const isAuthenticated = catchAsync(async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new AppError("Please login to continue", 401));
    }

    let { data } = await verifyToken(token);
    const user = await Users.findById(data.userId).lean();

    if (!user) return next(new AppError("User not found", 404));

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token Expired", 401));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Security alert: Invalid session", 401));
    }
    return next(new AppError("Internal Server Error", 500));
  }
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not allowed to perform this action", 403));
    }

    next();
  };
