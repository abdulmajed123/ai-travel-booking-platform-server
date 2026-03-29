"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const dashboardController = __importStar(require("../controllers/dashboard.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const router = express_1.default.Router();
// অ্যাডমিন স্ট্যাটাস কার্ডের ডাটা (Total Users, Items, Orders, Revenue)
router.get("/admin-stats", auth_middleware_1.auth, (0, authorize_middleware_1.authorize)("admin"), dashboardController.getAdminStats);
// অ্যাডমিন পাই চার্ট ডাটা (সব বুকিংয়ের স্ট্যাটাস ডিস্ট্রিবিউশন)
router.get("/admin-pie-data", auth_middleware_1.auth, (0, authorize_middleware_1.authorize)("admin"), dashboardController.getAdminPieChartData);
// চার্ট ডাটা (অ্যাডমিন হলে সব, ইউজার হলে শুধু নিজের মাসিক রিপোর্ট)
router.get("/chart-data", auth_middleware_1.auth, dashboardController.getChartData);
// ইউজারের ব্যক্তিগত স্ট্যাটাস (Total Bookings, Spent, Reviews)
router.get("/user-stats", auth_middleware_1.auth, dashboardController.getUserStats);
// ইউজারের ব্যক্তিগত পাই চার্ট ডাটা (নিজের বুকিং স্ট্যাটাস)
router.get("/user-pie-data", auth_middleware_1.auth, dashboardController.getUserPieChartData);
exports.DashboardRoutes = router;
