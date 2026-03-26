import { Schema, model } from "mongoose"; // এখানে express এর বদলে mongoose হবে

const reviewSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  },
  { timestamps: true },
);

export const Review = model("Review", reviewSchema);
