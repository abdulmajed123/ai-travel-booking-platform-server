import express from "express";
import * as UserCtrl from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = express.Router();

router.get("/me", auth, authorize("USER", "ADMIN"), UserCtrl.getMyProfile);
router.patch("/me", auth, authorize("USER", "ADMIN"), UserCtrl.updateMyProfile);

router.get("/", auth, authorize("ADMIN"), UserCtrl.getAllUsers);
router.get("/:id", auth, authorize("ADMIN"), UserCtrl.getUserById);
router.delete("/:id", auth, authorize("ADMIN"), UserCtrl.deleteUser);
router.patch("/role", auth, authorize("ADMIN"), UserCtrl.changeUserRole);

export const UserRoutes = router;
