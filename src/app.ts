// import express, { Application, Request, Response } from "express";
// import cors from "cors";
// import router from "./routes"; // এটি আপনার routes/index.ts (Central Router) কে কল করবে

// const app: Application = express();

// // ১. মিডেলওয়্যার (Middleware)
// app.use(cors());
// app.use(express.json());

// // ২. মেইন রাউটার কানেকশন
// // এখানে সরাসরি Auth বা User না লিখে শুধু "router" ব্যবহার করুন
// // কারণ আপনার routes/index.ts ফাইলের ভেতরেই সব মডিউল (Items, Auth, User) রেজিস্টার করা আছে
// app.use("/api/v1", router);

// // ৩. টেস্টিং রুট
// app.get("/", (req: Request, res: Response) => {
//   res.send("Travel Booking Platform Server is running!");
// });

// export default app;

import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./routes";

const app: Application = express();

// ১. মিডেলওয়্যার (CORS এবং JSON Parser)
app.use(
  cors({
    origin: "http://localhost:3000", // আপনার ফ্রন্টএন্ড পোর্ট
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// ২. মেইন রাউটার
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Travel Booking Platform Server is running!");
});

export default app;
