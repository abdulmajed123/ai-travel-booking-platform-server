import { Request, Response } from "express";
import User from "../models/user.model";
import AppError from "../utils/AppError";
import bcrypt from "bcrypt";
import config from "../config";

// ─── Get my profile ───────────────────────────────────────────────
export const getMyProfile = async (
  req: Request & { user?: any },
  res: Response,
) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) throw new AppError("User not found", 404);
  res.status(200).json({ success: true, user });
};

// ─── Update my profile ────────────────────────────────────────────
export const updateMyProfile = async (
  req: Request & { user?: any },
  res: Response,
) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError("User not found", 404);

  const { name, password, avatar } = req.body;

  if (name) user.name = name;
  if (avatar) user.avatar = avatar;
  if (password)
    user.password = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds || 12),
    );

  await user.save();
  const updatedUser = await User.findById(user._id).select("-password");
  res.status(200).json({ success: true, user: updatedUser });
};

// ─── Admin: Get all users ─────────────────────────────────────────
export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.status(200).json({ success: true, users });
};

// ─── Admin: Get user by ID ────────────────────────────────────────
export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new AppError("User not found", 404);
  res.status(200).json({ success: true, user });
};

// ─── Admin: Delete user ───────────────────────────────────────────
export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  res.status(200).json({ success: true, message: "User deleted successfully" });
};

// ─── Admin: Change user role ──────────────────────────────────────
export const changeUserRole = async (req: Request, res: Response) => {
  const { userId, role } = req.body;
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  if (!["USER", "ADMIN"].includes(role))
    throw new AppError("Role must be either USER or ADMIN", 400);

  user.role = role;
  await user.save();
  res
    .status(200)
    .json({ success: true, message: "User role updated successfully", user });
};
