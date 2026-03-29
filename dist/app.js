"use strict";
// import express, { Application, Request, Response } from "express";
// import cors from "cors";
// import router from "./routes";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app: Application = express();
// // ১. মিডেলওয়্যার (CORS এবং JSON Parser)
// app.use(
//   cors({
//     origin: "http://localhost:3000", // আপনার ফ্রন্টএন্ড পোর্ট
//     credentials: true,
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );
// app.use(express.json());
// // ২. মেইন রাউটার
// app.use("/api/v1", router);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Travel Booking Platform Server is running!");
// });
// export default app;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// --- এই অংশটি পরিবর্তন করুন ---
app.use(express_1.default.json({ limit: "10mb" })); // ১০ মেগাবাইট পর্যন্ত ডাটা এলাউ করা হলো
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
// --------------------------
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Travel Booking Platform Server is running!");
});
exports.default = app;
