import express from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { auth } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = express.Router();

// অ্যাডমিন স্ট্যাটাস কার্ডের ডাটা (Total Users, Items, Orders, Revenue)
router.get(
  "/admin-stats",
  auth,
  authorize("admin"),
  dashboardController.getAdminStats,
);

// অ্যাডমিন পাই চার্ট ডাটা (সব বুকিংয়ের স্ট্যাটাস ডিস্ট্রিবিউশন)
router.get(
  "/admin-pie-data",
  auth,
  authorize("admin"),
  dashboardController.getAdminPieChartData,
);

// চার্ট ডাটা (অ্যাডমিন হলে সব, ইউজার হলে শুধু নিজের মাসিক রিপোর্ট)
router.get("/chart-data", auth, dashboardController.getChartData);

// ইউজারের ব্যক্তিগত স্ট্যাটাস (Total Bookings, Spent, Reviews)
router.get("/user-stats", auth, dashboardController.getUserStats);

// ইউজারের ব্যক্তিগত পাই চার্ট ডাটা (নিজের বুকিং স্ট্যাটাস)
router.get("/user-pie-data", auth, dashboardController.getUserPieChartData);

export const DashboardRoutes = router;
