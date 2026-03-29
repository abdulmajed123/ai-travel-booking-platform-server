"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // User মডেলের সাথে কানেকশন
        required: true,
    },
    itemId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Item", // আপনার ট্রাভেল বা প্রোডাক্ট মডেলের নাম
        required: true,
    },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending",
    },
}, { timestamps: true });
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
