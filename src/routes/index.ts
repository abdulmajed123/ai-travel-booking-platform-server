// import express from "express";
// import { itemRoutes } from "./item.routes";
// import { UserRoutes } from "./user.routes";
// import { AuthRoutes } from "./auth.routes";
// // Alada Auth route import korun

// const router = express.Router();

// const moduleRoutes = [
//   {
//     path: "/items",
//     route: itemRoutes,
//   },
//   {
//     path: "/users",
//     route: UserRoutes, // Sudhu profile ebong admin er kajer jonno
//   },
//   {
//     path: "/auth",
//     route: AuthRoutes, // Sudhu login, register, refresh-token er jonno
//   },
// ];

// moduleRoutes.forEach(({ path, route }) => {
//   router.use(path, route);
// });

// export default router;

import express from "express";
import { itemRoutes } from "./item.routes";
import { UserRoutes } from "./user.routes";
import { AuthRoutes } from "./auth.routes";
import { bookingRoutes } from "./booking.routes"; // ✅ ১. বুকিং রাউট ইমপোর্ট করুন
import { reviewRoutes } from "./review.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/items",
    route: itemRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/bookings", // ✅ ২. এখানে বুকিং পাথটি যোগ করুন
    route: bookingRoutes,
  },
  {
    path: "/reviews",
    route: reviewRoutes,
  },
];

moduleRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
