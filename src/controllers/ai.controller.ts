// import { Request, Response } from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // .env থেকে API Key নিতে হবে
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// export const aiChatbot = async (req: Request, res: Response) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a question/prompt",
//       });
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // AI কে ট্রাভেল গাইড হিসেবে কাজ করার নির্দেশ দেওয়া (Optional but good)
//     const result = await model.generateContent(
//       `Act as a travel expert. ${prompt}`,
//     );
//     const response = await result.response;
//     const text = response.text();

//     // আপনার রিকোয়ারমেন্ট অনুযায়ী Standard Response
//     res.status(200).json({
//       success: true,
//       message: "Request successful",
//       data: text,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong with AI",
//     });
//   }
// };

import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const aiChatbot = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question/prompt",
      });
    }

    // ১. জেনারেটিভ এআই ইনিশিয়ালাইজেশন ফাংশনের ভেতরে নিয়ে আসা ভালো (Environment Variable রিড করার জন্য)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ২. জেনারেশন শুরু
    const result = await model.generateContent(
      `Act as a travel expert. ${prompt}`,
    );

    // ৩. নতুন SDK ভার্সনে response এর আগে 'await' ব্যবহার করা বাধ্যতামূলক
    const response = await result.response;
    const text = response.text();

    // ৪. টেক্সট খালি কি না চেক করা (Safety Filter এর কারণে খালি হতে পারে)
    if (!text) {
      throw new Error("AI could not generate a response for this prompt.");
    }

    res.status(200).json({
      success: true,
      message: "Request successful",
      data: text,
    });
  } catch (error: any) {
    console.error("Gemini Error:", error); // এটি আপনার Render Logs এ কারণ দেখাবে
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong with AI",
    });
  }
};
