"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiChatbot = void 0;
const generative_ai_1 = require("@google/generative-ai");
// .env থেকে API Key নিতে হবে
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiChatbot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Please provide a question/prompt",
            });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // AI কে ট্রাভেল গাইড হিসেবে কাজ করার নির্দেশ দেওয়া (Optional but good)
        const result = yield model.generateContent(`Act as a travel expert. ${prompt}`);
        const response = yield result.response;
        const text = response.text();
        // আপনার রিকোয়ারমেন্ট অনুযায়ী Standard Response
        res.status(200).json({
            success: true,
            message: "Request successful",
            data: text,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong with AI",
        });
    }
});
exports.aiChatbot = aiChatbot;
