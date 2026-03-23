import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // User মডেলের সাথে কানেকশন
      required: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true },
);

export const Booking = model("Booking", bookingSchema);
