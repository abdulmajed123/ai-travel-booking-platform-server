"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const review_controller_1 = require("../controllers/review.controller");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.auth, review_controller_1.createReview);
router.get("/my-reviews", auth_middleware_1.auth, review_controller_1.getMyReviews); // এই লাইনটি আপনার ছিল না, এটি যোগ করুন
router.get("/item/:itemId", review_controller_1.getItemReviews);
router.delete("/:id", auth_middleware_1.auth, review_controller_1.deleteReview);
exports.reviewRoutes = router;
