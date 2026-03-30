import express from "express";
import { itemRoutes } from "./item.routes";
import { UserRoutes } from "./user.routes";
import { AuthRoutes } from "./auth.routes";
import { bookingRoutes } from "./booking.routes";
import { reviewRoutes } from "./review.routes";
import { AiRoutes } from "./ai.routes";
import { DashboardRoutes } from "./dashboard.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/items", route: itemRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/bookings", route: bookingRoutes },
  { path: "/reviews", route: reviewRoutes },
  { path: "/dashboard", route: DashboardRoutes },
  { path: "/ai", route: AiRoutes },
];

moduleRoutes.forEach(({ path, route }) => {
  // যদি কোনো কারণে route undefined থাকে তবে এটি এরর হ্যান্ডেল করবে
  if (route) {
    router.use(path, route);
  } else {
    console.warn(`Route for ${path} is undefined! Check your imports.`);
  }
});

export default router;
