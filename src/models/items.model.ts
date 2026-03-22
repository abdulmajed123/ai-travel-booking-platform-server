import { Schema, model } from "mongoose";
import { IItem } from "../types/item.interface";

const itemSchema = new Schema<IItem>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const Item = model<IItem>("Item", itemSchema);
