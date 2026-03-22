import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
export const authorize = (...roles: string[]) => {
  return (
    req: Request & { user?: any },
    _res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) return next(new AppError("Not authenticated", 401));

    if (req.user.role === "super-admin") return next();

    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission", 403));
    }
    next();
  };
};
