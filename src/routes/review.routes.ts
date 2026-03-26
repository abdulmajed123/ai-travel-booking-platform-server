import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  createReview,
  getItemReviews,
  deleteReview,
  getMyReviews, // এটি যোগ করুন
} from "../controllers/review.controller";

const router = Router();

router.post("/", auth, createReview);
router.get("/my-reviews", auth, getMyReviews); // এই লাইনটি আপনার ছিল না, এটি যোগ করুন
router.get("/item/:itemId", getItemReviews);
router.delete("/:id", auth, deleteReview);

export const reviewRoutes = router;
