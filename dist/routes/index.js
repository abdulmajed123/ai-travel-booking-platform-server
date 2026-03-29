"use strict";
// import express from "express";
// import { itemRoutes } from "./item.routes";
// import { UserRoutes } from "./user.routes";
// import { AuthRoutes } from "./auth.routes";
// // Alada Auth route import korun
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const item_routes_1 = require("./item.routes");
const user_routes_1 = require("./user.routes");
const auth_routes_1 = require("./auth.routes");
const booking_routes_1 = require("./booking.routes");
const review_routes_1 = require("./review.routes");
const ai_routes_1 = require("./ai.routes");
const dashboard_routes_1 = require("./dashboard.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    { path: "/items", route: item_routes_1.itemRoutes },
    { path: "/users", route: user_routes_1.UserRoutes },
    { path: "/auth", route: auth_routes_1.AuthRoutes },
    { path: "/bookings", route: booking_routes_1.bookingRoutes },
    { path: "/reviews", route: review_routes_1.reviewRoutes },
    { path: "/dashboard", route: dashboard_routes_1.DashboardRoutes },
    { path: "/ai", route: ai_routes_1.AiRoutes },
];
moduleRoutes.forEach(({ path, route }) => {
    // যদি কোনো কারণে route undefined থাকে তবে এটি এরর হ্যান্ডেল করবে
    if (route) {
        router.use(path, route);
    }
    else {
        console.warn(`Route for ${path} is undefined! Check your imports.`);
    }
});
exports.default = router;
