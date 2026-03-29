"use strict";
// import { Request, Response } from "express";
// import { Review } from "../models/review.model";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.getMyReviews = exports.getItemReviews = exports.createReview = void 0;
const review_model_1 = require("../models/review.model");
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rating, comment, itemId } = req.body;
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user._id);
        if (!userId) {
            return res
                .status(401)
                .json({ success: false, message: "User not authenticated" });
        }
        const review = yield review_model_1.Review.create({
            rating: Number(rating),
            comment,
            itemId,
            userId,
        });
        res.status(201).json({ success: true, data: review });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.createReview = createReview;
const getItemReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const reviews = yield review_model_1.Review.find({ itemId }).populate("userId", "name email avatar");
        res.status(200).json({ success: true, data: reviews });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getItemReviews = getItemReviews;
const getMyReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user._id);
        const reviews = yield review_model_1.Review.find({ userId })
            .populate({
            path: "itemId",
            select: "title image price",
        })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reviews });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getMyReviews = getMyReviews;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield review_model_1.Review.findByIdAndDelete(id);
        res
            .status(200)
            .json({ success: true, message: "Review deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
});
exports.deleteReview = deleteReview;
