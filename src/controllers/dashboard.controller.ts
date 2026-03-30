import { Request, Response } from "express";
import mongoose from "mongoose";
import { Booking } from "../models/booking.model";
import { Item } from "../models/items.model";
import { Review } from "../models/review.model";
import User from "../models/user.model";
import AppError from "../utils/AppError";

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalItems, totalOrders] = await Promise.all([
      User.countDocuments({}),
      Item.countDocuments({}),
      Booking.countDocuments({}),
    ]);

    const revenueData = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["pending", "confirmed", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalItems,
        totalOrders,
        totalRevenue: revenueData[0]?.total || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminPieChartData = async (req: Request, res: Response) => {
  try {
    const pieData = await Booking.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
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
    const user = req.user as any;
    const userId = user?.id || user?._id;
    const role = user?.role?.toLowerCase();

    const filter =
      role === "admin" ? {} : { userId: new mongoose.Types.ObjectId(userId) };

    const chartData = await Booking.aggregate([
      { $match: filter },
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
    const user = req.user as any;
    const userId = user?.id || user?._id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const pieData = await Booking.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: "$status", value: { $sum: 1 } } },
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
    const user = req.user as any;
    const rawUserId = user?.id || user?._id;

    if (!rawUserId) throw new AppError("User not authenticated", 401);

    const userObjectId = new mongoose.Types.ObjectId(rawUserId);

    const [totalBookings, totalReviews] = await Promise.all([
      Booking.countDocuments({ userId: rawUserId }),
      Review.countDocuments({ userId: rawUserId }),
    ]);

    const spentData = await Booking.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: { $in: ["pending", "confirmed", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
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
    res.status(500).json({ success: false, message: error.message });
  }
};
