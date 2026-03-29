"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const auth = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return next(new AppError_1.default("Token missing", 401));
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        console.log("Secrte", config_1.default.jwt_secret);
        console.log(decoded);
        req.user = decoded;
        console.log(req.user);
        next();
    }
    catch (_a) {
        return next(new AppError_1.default("Invalid token", 401));
    }
};
exports.auth = auth;
