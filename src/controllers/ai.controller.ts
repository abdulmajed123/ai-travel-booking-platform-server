import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// .env থেকে API Key নিতে হবে
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const aiChatbot = async (req: Request, res: Response) => {
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
    const result = await model.generateContent(
      `Act as a travel expert. ${prompt}`,
    );
    const response = await result.response;
    const text = response.text();

    // আপনার রিকোয়ারমেন্ট অনুযায়ী Standard Response
    res.status(200).json({
      success: true,
      message: "Request successful",
      data: text,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong with AI",
    });
  }
};
