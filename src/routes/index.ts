// import express from "express";
// import { itemRoutes } from "./item.routes";
// import { UserRoutes } from "./user.routes";

// const router = express.Router();

// const moduleRoutes = [
//   {
//     path: "/items",
//     route: itemRoutes,
//   },
//   {
//     path: "/users",
//     route: UserRoutes,
//   },
// ];

// moduleRoutes.forEach(({ path, route }) => {
//   router.use(path, route);
// });

// export default router;

import express from "express";
import { itemRoutes } from "./item.routes";
import { UserRoutes } from "./user.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/items",
    route: itemRoutes,
  },
  {
    path: "/users", // এখান থেকে এক্সেস হবে /api/v1/users/me, /api/v1/users/ (get all) ইত্যাদি
    route: UserRoutes,
  },
  {
    path: "/auth", // এটি যোগ করুন! এখান থেকে এক্সেস হবে /api/v1/auth/register এবং /api/v1/auth/login
    route: UserRoutes,
  },
];

moduleRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
