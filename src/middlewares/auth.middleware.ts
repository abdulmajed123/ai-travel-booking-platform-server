import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import AppError from "../utils/AppError";

export const auth = (
  req: Request & { user?: any },
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return next(new AppError("Token missing", 401));

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    console.log(decoded);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch {
    return next(new AppError("Invalid token", 401));
  }
};
