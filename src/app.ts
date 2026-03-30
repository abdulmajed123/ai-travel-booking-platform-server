import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./routes";

const app: Application = express();

app.use(
  cors({
    // origin: process.env.CLIENT_URL || "http://localhost:3000",
    origin: [
      "http://localhost:3000",
      "http://localhost:3001", // আপনার পোর্টে ঝামেলা থাকলে এটিও নিরাপদ
      "https://ai-travel-booking-platform-client.vercel.app", // আপনার ভার্সেল লিঙ্ক
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// --- এই অংশটি পরিবর্তন করুন ---
app.use(express.json({ limit: "10mb" })); // ১০ মেগাবাইট পর্যন্ত ডাটা এলাউ করা হলো
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// --------------------------

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Travel Booking Platform Server is running!");
});

export default app;
