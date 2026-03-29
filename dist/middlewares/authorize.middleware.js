"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const AppError_1 = __importDefault(require("../utils/AppError"));
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user)
            return next(new AppError_1.default("Not authenticated", 401));
        // 'USER' বা 'ADMIN' যাই আসুক তাকে ছোট হাতের করে নিন
        const userRole = req.user.role.toLowerCase();
        if (userRole === "super-admin")
            return next();
        // roles লিস্টের সব আইটেমকেও ছোট হাতের করে চেক করুন
        const normalizedRoles = roles.map((role) => role.toLowerCase());
        if (!normalizedRoles.includes(userRole)) {
            return next(new AppError_1.default("You do not have permission", 403));
        }
        next();
    };
};
exports.authorize = authorize;
