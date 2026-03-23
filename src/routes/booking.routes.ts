import { Router } from "express";
// ১. ইমপোর্টের নাম 'validateRole' থেকে বদলে 'authorize' করুন
import { authorize } from "../middlewares/authorize.middleware";
import { auth } from "../middlewares/auth.middleware";
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/booking.controller";

const router = Router();

// ২. নিচে যেখানে validateRole ছিল, সেখানে authorize ব্যবহার করুন
router.post("/", auth, createBooking);
router.get("/", auth, getBookings);

// এখানে authorize("admin", "manager") হবে
router.patch("/:id", auth, authorize("admin", "manager"), updateBookingStatus);

// এখানে authorize("admin") হবে
router.delete("/:id", auth, authorize("admin"), deleteBooking);

export const bookingRoutes = router;
