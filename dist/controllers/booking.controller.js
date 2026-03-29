"use strict";
// import { Request, Response } from "express";
// import AppError from "../utils/AppError";
// import { Booking } from "../models/booking.model";
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
exports.deleteBooking = exports.updateBookingStatus = exports.getBookings = exports.createBooking = void 0;
const booking_model_1 = require("../models/booking.model");
const AppError_1 = __importDefault(require("../utils/AppError"));
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId, quantity, price } = req.body;
        const user = req.user; // Type casting to bypass TS error
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user._id);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "ইউজার অথেন্টিকেশন পাওয়া যায়নি!",
            });
        }
        const newBooking = yield booking_model_1.Booking.create({
            userId,
            itemId,
            quantity,
            price,
        });
        const populatedBooking = yield booking_model_1.Booking.findById(newBooking._id)
            .populate("userId", "name email")
            .populate("itemId");
        res.status(201).json({
            success: true,
            message: "বুকিং সফলভাবে সম্পন্ন হয়েছে",
            data: populatedBooking,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "সার্ভারে সমস্যা হয়েছে",
        });
    }
});
exports.createBooking = createBooking;
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const role = user === null || user === void 0 ? void 0 : user.role;
        const id = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user._id);
        let query = {};
        if (role !== "admin") {
            query = { userId: id };
        }
        const bookings = yield booking_model_1.Booking.find(query)
            .populate("userId", "name email")
            .populate("itemId");
        res.status(200).json({ success: true, data: bookings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getBookings = getBookings;
const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const booking = yield booking_model_1.Booking.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!booking)
            throw new AppError_1.default("Booking not found", 404);
        res.status(200).json({ success: true, data: booking });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateBookingStatus = updateBookingStatus;
const deleteBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const booking = yield booking_model_1.Booking.findByIdAndDelete(id);
        if (!booking)
            throw new AppError_1.default("Booking not found", 404);
        res
            .status(200)
            .json({ success: true, message: "Booking deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteBooking = deleteBooking;
