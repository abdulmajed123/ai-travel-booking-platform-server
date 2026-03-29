"use strict";
// import { Request, Response } from "express";
// import mongoose from "mongoose";
// import { Booking } from "../models/booking.model";
// import { Item } from "../models/items.model";
// import { Review } from "../models/review.model";
// import User from "../models/user.model";
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
exports.getUserStats = exports.getUserPieChartData = exports.getChartData = exports.getAdminPieChartData = exports.getAdminStats = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = require("../models/booking.model");
const items_model_1 = require("../models/items.model");
const review_model_1 = require("../models/review.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const getAdminStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [totalUsers, totalItems, totalOrders] = yield Promise.all([
            user_model_1.default.countDocuments({}),
            items_model_1.Item.countDocuments({}),
            booking_model_1.Booking.countDocuments({}),
        ]);
        const revenueData = yield booking_model_1.Booking.aggregate([
            {
                $match: {
                    status: { $in: ["pending", "confirmed", "completed"] },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ["$price", "$quantity"] } },
                },
            },
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalItems,
                totalOrders,
                totalRevenue: ((_a = revenueData[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAdminStats = getAdminStats;
const getAdminPieChartData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pieData = yield booking_model_1.Booking.aggregate([
            { $group: { _id: "$status", value: { $sum: 1 } } },
        ]);
        const formattedPieData = pieData.map((item) => ({
            name: item._id ? item._id.toUpperCase() : "UNKNOWN",
            value: item.value,
        }));
        res.status(200).json({ success: true, data: formattedPieData });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAdminPieChartData = getAdminPieChartData;
const getChartData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user._id);
        const role = (_a = user === null || user === void 0 ? void 0 : user.role) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const filter = role === "admin" ? {} : { userId: new mongoose_1.default.Types.ObjectId(userId) };
        const chartData = yield booking_model_1.Booking.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    orders: { $sum: 1 },
                    revenue: { $sum: { $multiply: ["$price", "$quantity"] } },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const formattedData = chartData.map((item) => ({
            name: monthNames[item._id - 1],
            orders: item.orders,
            revenue: item.revenue,
        }));
        res.status(200).json({ success: true, data: formattedData });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getChartData = getChartData;
const getUserPieChartData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user._id);
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const pieData = yield booking_model_1.Booking.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: "$status", value: { $sum: 1 } } },
        ]);
        const formattedPieData = pieData.map((item) => ({
            name: item._id ? item._id.toUpperCase() : "UNKNOWN",
            value: item.value,
        }));
        res.status(200).json({ success: true, data: formattedPieData });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getUserPieChartData = getUserPieChartData;
const getUserStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const rawUserId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user._id);
        if (!rawUserId)
            throw new AppError_1.default("User not authenticated", 401);
        const userObjectId = new mongoose_1.default.Types.ObjectId(rawUserId);
        const [totalBookings, totalReviews] = yield Promise.all([
            booking_model_1.Booking.countDocuments({ userId: rawUserId }),
            review_model_1.Review.countDocuments({ userId: rawUserId }),
        ]);
        const spentData = yield booking_model_1.Booking.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    status: { $in: ["pending", "confirmed", "completed"] },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ["$price", "$quantity"] } },
                },
            },
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalBookings: totalBookings || 0,
                totalSpent: ((_a = spentData[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                totalReviews: totalReviews || 0,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getUserStats = getUserStats;
