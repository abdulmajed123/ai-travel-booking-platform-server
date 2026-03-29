import { Request, Response } from "express";
import mongoose from "mongoose";
import { Booking } from "../models/booking.model";
import { Item } from "../models/items.model";
import { Review } from "../models/review.model";
import User from "../models/user.model";

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalItems, totalOrders] = await Promise.all([
      User.countDocuments({}),
      Item.countDocuments({}),
      Booking.countDocuments({}),
    ]);

    console.log("Checking Models:", { User, Item, Booking });

    // Revenue calculation
    const revenueData = await Booking.aggregate([
      {
        $match: {
          // আপনার বর্তমান ডাটাতে সব স্ট্যাটাস "pending", তাই আমি এটিও ইনক্লুড করলাম
          // ভবিষ্যতে confirmed হলে সেটিও যোগ হবে
          status: { $in: ["pending", "confirmed", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $multiply: ["$price", "$quantity"] },
          },
        },
      },
    ]);

    const finalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    console.log("Stats to be sent:", {
      totalUsers,
      totalItems,
      totalOrders,
      finalRevenue,
    });
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalItems,
        totalOrders,
        totalRevenue: finalRevenue,
      },
    });
  } catch (error: any) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminPieChartData = async (req: Request, res: Response) => {
  try {
    const pieData = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 },
        },
      },
    ]);

    const formattedPieData = pieData.map((item) => ({
      name: item._id ? item._id.toUpperCase() : "UNKNOWN",
      value: item.value,
    }));

    res.status(200).json({ success: true, data: formattedPieData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChartData = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const role = req.user.role.toLowerCase();

    // লজিক: অ্যাডমিন হলে সব বুকিং, ইউজার হলে শুধু তার নিজের (userId) বুকিং
    const filter =
      role === "admin" ? {} : { userId: new mongoose.Types.ObjectId(userId) };

    const chartData = await Booking.aggregate([
      {
        $match: filter, // এখানে ফিল্টারটি অ্যাপ্লাই করা হয়েছে
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          orders: { $sum: 1 },
          revenue: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedData = chartData.map((item) => ({
      name: monthNames[item._id - 1],
      orders: item.orders,
      revenue: item.revenue,
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserPieChartData = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const pieData = await Booking.aggregate([
      {
        $match: { userId: userObjectId }, // শুধুমাত্র এই ইউজারের বুকিং ফিল্টার
      },
      {
        $group: {
          _id: "$status", // স্ট্যাটাস অনুযায়ী গ্রুপ করা (Pending/Confirmed/Cancelled)
          value: { $sum: 1 },
        },
      },
    ]);

    const formattedPieData = pieData.map((item) => ({
      name: item._id ? item._id.toUpperCase() : "UNKNOWN",
      value: item.value,
    }));

    res.status(200).json({ success: true, data: formattedPieData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    // ১. ইউজার আইডি নিশ্চিত করা
    const rawUserId = req.user?.id || req.user?._id;

    if (!rawUserId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const userObjectId = new mongoose.Types.ObjectId(rawUserId);

    // ২. বুকিং এবং রিভিউ কাউন্ট করা (এটি স্ট্রিং আইডি দিয়েও কাজ করে)
    const [totalBookings, totalReviews] = await Promise.all([
      Booking.countDocuments({ userId: rawUserId }),
      Review.countDocuments({ userId: rawUserId }),
    ]);

    // ৩. টোটাল খরচ (Aggregation)
    const spentData = await Booking.aggregate([
      {
        $match: {
          userId: userObjectId, // অবশ্যই ObjectId হতে হবে
          // এখানে 'pending' এবং 'confirmed' উভয়ই রাখা হয়েছে যাতে নতুন বুকিং করলেও ডাটা দেখায়
          status: { $in: ["pending", "confirmed", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          // আপনার মডেলে price এবং quantity দুটোই Number, তাই সরাসরি গুণ হবে
          total: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings: totalBookings || 0,
        totalSpent: spentData[0]?.total || 0,
        totalReviews: totalReviews || 0,
      },
    });
  } catch (error: any) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
