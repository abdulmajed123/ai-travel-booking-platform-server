"use strict";
// import { Request, Response } from "express";
// import User from "../models/user.model";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import config from "../config";
// import AppError from "../utils/AppError";
// import passport from "../config/passport";
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
exports.googleCallback = exports.googleAuth = exports.refreshToken = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const passport_1 = __importDefault(require("../config/passport"));
const generateTokens = (payload) => ({
    accessToken: jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, payload), { role: payload.role.toLowerCase() }), config_1.default.jwt_secret, // এখানে 'as string' যোগ করা হয়েছে
    { expiresIn: config_1.default.jwt_expires_in }),
    refreshToken: jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, payload), { role: payload.role.toLowerCase() }), config_1.default.jwt_refresh_secret, // এখানেও 'as string'
    {
        expiresIn: config_1.default.jwt_refresh_expires_in,
    }),
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, avatar } = req.body;
    const existing = yield user_model_1.default.findOne({ email });
    if (existing)
        throw new AppError_1.default("User already exists", 400);
    const user = yield user_model_1.default.create({
        name,
        email,
        password,
        role,
        avatar,
        isVerified: true,
    });
    const tokens = generateTokens({
        id: user._id,
        email: user.email,
        role: user.role,
    });
    res.status(201).json(Object.assign({ success: true, user }, tokens));
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    if (!user)
        throw new AppError_1.default("Invalid email or password", 401);
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match)
        throw new AppError_1.default("Invalid email or password", 401);
    const tokens = generateTokens({
        id: user._id,
        email: user.email,
        role: user.role,
    });
    res.status(200).json(Object.assign({ success: true, user }, tokens));
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken)
        throw new AppError_1.default("Refresh token required", 400);
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
        const tokens = generateTokens({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        });
        res.status(200).json(Object.assign({ success: true }, tokens));
    }
    catch (_a) {
        throw new AppError_1.default("Invalid or expired refresh token", 401);
    }
});
exports.refreshToken = refreshToken;
// Google OAuth
const googleAuth = (req, res, next) => {
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })(req, res, next);
};
exports.googleAuth = googleAuth;
const googleCallback = (req, res, next) => {
    passport_1.default.authenticate("google", { session: false }, (err, user) => {
        if (err || !user) {
            return res.redirect(`${config_1.default.client_url}/login?error=google_failed`);
        }
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role ? user.role.toLowerCase() : "user",
        };
        const token = jsonwebtoken_1.default.sign(payload, config_1.default.jwt_secret, // টাইপ কাস্টিং
        { expiresIn: config_1.default.jwt_expires_in });
        return res.redirect(`${config_1.default.client_url}/?accessToken=${token}`);
    })(req, res, next);
};
exports.googleCallback = googleCallback;
