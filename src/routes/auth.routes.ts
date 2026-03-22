import express from "express";
import * as AuthCtrl from "../controllers/auth.controller";
import validate from "../middlewares/validate.middleware";
import { z } from "zod";

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/register", validate(registerSchema), AuthCtrl.register);
router.post("/login", validate(loginSchema), AuthCtrl.login);
router.get("/google", AuthCtrl.googleAuth);
router.get("/google/callback", AuthCtrl.googleCallback);

export const AuthRoutes = router;
