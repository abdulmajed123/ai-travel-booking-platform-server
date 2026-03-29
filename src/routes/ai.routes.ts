import { Router } from "express";
import { aiChatbot } from "../controllers/ai.controller";

const router = Router();

// POST /api/ai/chat
router.post("/chat", aiChatbot);

export const AiRoutes = router;
