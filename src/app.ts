// import cors from "cors";
// import express, { Application, NextFunction, Request, Response } from "express";
// import router from "./routes";

// const app: Application = express();

// // 1. Parsers (Shobar upore thaka dorkar)
// app.use(express.json());
// app.use(cors());

// // 2. Application routes
// app.use("/api/v1", router);

// // 3. Testing route
// app.get("/", (req: Request, res: Response) => {
//   res.send("Travel Booking Platform Server is running!");
// });

// // 4. Global Error Handler (Eita Route-er niche kintu Not Found-er upore thakbe)
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error!";

//   return res.status(statusCode).json({
//     success: false,
//     message: message,
//     // stack: process.env.NODE_ENV === 'development' ? err.stack : null, // Optional: Debugging-er jonno
//   });
// });

// // 5. Not found route (Eita ekdom niche thakbe)
// app.use((req: Request, res: Response) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// export default app;

import express from "express";
import cors from "cors";
import { AuthRoutes } from "./routes/auth.routes";
import { UserRoutes } from "./routes/user.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);

app.get("/", (_, res) => res.send("Server is running"));

export default app;
