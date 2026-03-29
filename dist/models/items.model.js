"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: String,
    image: { type: String, required: true },
    images: [String],
    price: { type: Number, required: true },
    discountPrice: Number,
    rating: { type: Number, default: 0 },
    location: {
        country: String,
        city: String,
        area: String,
    },
    category: { type: String, required: true },
    duration: String,
    availableDates: [Date],
    facilities: [String],
    highlights: [String],
    maxPeople: Number,
    availableSeats: Number,
    itinerary: [
        {
            day: Number,
            title: String,
            description: String,
        },
    ],
    aiTags: [String],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
exports.Item = (0, mongoose_1.model)("Item", itemSchema);
