import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

export const authorize = (...roles: string[]) => {
  return (
    req: Request & { user?: any },
    _res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) return next(new AppError("Not authenticated", 401));

    // 'USER' বা 'ADMIN' যাই আসুক তাকে ছোট হাতের করে নিন
    const userRole = req.user.role.toLowerCase();

    if (userRole === "super-admin") return next();

    // roles লিস্টের সব আইটেমকেও ছোট হাতের করে চেক করুন
    const normalizedRoles = roles.map((role) => role.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return next(new AppError("You do not have permission", 403));
    }
    next();
  };
};
