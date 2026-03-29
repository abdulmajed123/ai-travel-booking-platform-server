"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRoutes = void 0;
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
// POST /api/ai/chat
router.post("/chat", ai_controller_1.aiChatbot);
exports.AiRoutes = router;
