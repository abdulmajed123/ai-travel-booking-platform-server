"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = require("express");
// ১. ইমপোর্টের নাম 'validateRole' থেকে বদলে 'authorize' করুন
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const booking_controller_1 = require("../controllers/booking.controller");
const router = (0, express_1.Router)();
// ২. নিচে যেখানে validateRole ছিল, সেখানে authorize ব্যবহার করুন
router.post("/", auth_middleware_1.auth, booking_controller_1.createBooking);
router.get("/", auth_middleware_1.auth, booking_controller_1.getBookings);
// এখানে authorize("admin", "manager") হবে
router.patch("/:id", auth_middleware_1.auth, (0, authorize_middleware_1.authorize)("admin", "manager"), booking_controller_1.updateBookingStatus);
// এখানে authorize("admin") হবে
router.delete("/:id", auth_middleware_1.auth, (0, authorize_middleware_1.authorize)("admin"), booking_controller_1.deleteBooking);
exports.bookingRoutes = router;
