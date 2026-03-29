"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserRole = exports.deleteUser = exports.getUserById = exports.getAllUsers = exports.updateMyProfile = exports.getMyProfile = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config"));
// ─── Get my profile ───────────────────────────────────────────────
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.user.id).select("-password");
    if (!user)
        throw new AppError_1.default("User not found", 404);
    res.status(200).json({ success: true, user });
});
exports.getMyProfile = getMyProfile;
// backend/controllers/user.controller.ts-এ গিয়ে এই অংশটুকু চেক করুন
const updateMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, avatar, password } = req.body;
    // পেলোড থেকে ID নিন (নিশ্চিত করুন আপনার auth মিডলওয়্যার req.user.id সেট করছে)
    const userId = req.user.id;
    const updateData = Object.assign(Object.assign({}, (name && { name })), (avatar && { avatar }));
    // যদি পাসওয়ার্ড আপডেট করতে চান তবে সেটি হ্যাশ করে নিতে হবে
    if (password) {
        updateData.password = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    }
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true }).select("-password");
    if (!updatedUser)
        throw new AppError_1.default("User not found", 404);
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
    });
});
exports.updateMyProfile = updateMyProfile;
// ─── Admin: Get all users ─────────────────────────────────────────
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find().select("-password");
    res.status(200).json({ success: true, users });
});
exports.getAllUsers = getAllUsers;
// ─── Admin: Get user by ID ────────────────────────────────────────
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.params.id).select("-password");
    if (!user)
        throw new AppError_1.default("User not found", 404);
    res.status(200).json({ success: true, user });
});
exports.getUserById = getUserById;
// ─── Admin: Delete user ───────────────────────────────────────────
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndDelete(req.params.id);
    if (!user)
        throw new AppError_1.default("User not found", 404);
    res.status(200).json({ success: true, message: "User deleted successfully" });
});
exports.deleteUser = deleteUser;
// ─── Admin: Change user role ──────────────────────────────────────
const changeUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.body;
    const user = yield user_model_1.default.findById(userId);
    if (!user)
        throw new AppError_1.default("User not found", 404);
    if (!["USER", "ADMIN"].includes(role))
        throw new AppError_1.default("Role must be either USER or ADMIN", 400);
    user.role = role;
    yield user.save();
    res
        .status(200)
        .json({ success: true, message: "User role updated successfully", user });
});
exports.changeUserRole = changeUserRole;
