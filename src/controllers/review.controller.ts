import { Request, Response } from "express";
import { Review } from "../models/review.model";

export const createReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment, itemId } = req.body;
    const user = req.user as any;
    const userId = user?.id || user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const review = await Review.create({
      rating: Number(rating),
      comment,
      itemId,
      userId,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getItemReviews = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const reviews = await Review.find({ itemId }).populate(
      "userId",
      "name email avatar",
    );

    res.status(200).json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyReviews = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const userId = user?.id || user?._id;

    const reviews = await Review.find({ userId })
      .populate({
        path: "itemId",
        select: "title image price",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
