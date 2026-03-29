import { Request, Response } from "express";
import AppError from "../utils/AppError";
import { Booking } from "../models/booking.model";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { itemId, quantity, price } = req.body;

    // ১. ইউজার আইডি নিশ্চিত করা
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "ইউজার অথেন্টিকেশন পাওয়া যায়নি!" });
    }

    // ২. বুকিং তৈরি করা
    const newBooking = await Booking.create({
      userId,
      itemId,
      quantity,
      price,
    });

    // ৩. সমস্যা সমাধান: তৈরি করা বুকিংটিকে সাথে সাথে পপুলেট করা
    // যাতে রেসপন্সে userId এর জায়গায় পুরো অবজেক্ট (নাম, ইমেইলসহ) আসে
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("userId", "name email")
      .populate("itemId");

    res.status(201).json({
      success: true,
      message: "বুকিং সফলভাবে সম্পন্ন হয়েছে",
      data: populatedBooking, // এখানে পপুলেট করা ডাটা পাঠাচ্ছি
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "সার্ভারে সমস্যা হয়েছে",
    });
  }
};

// ২. বুকিং লিস্ট দেখা (GET)
export const getBookings = async (req: Request, res: Response) => {
  const { role, id } = req.user;

  let query = {};
  // যদি ইউজার হয় তবে শুধু তার নিজের বুকিং, অ্যাডমিন হলে সব বুকিং
  if (role !== "admin") {
    query = { userId: id };
  }

  const bookings = await Booking.find(query)
    .populate("userId")
    .populate("itemId");
  res.status(200).json({ success: true, data: bookings });
};

// ৩. স্ট্যাটাস আপডেট করা (PATCH)
export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  );

  if (!booking) throw new AppError("Booking not found", 404);
  res.status(200).json({ success: true, data: booking });
};

// ৪. বুকিং ডিলিট করা (DELETE)
export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await Booking.findByIdAndDelete(id);

  if (!booking) throw new AppError("Booking not found", 404);
  res
    .status(200)
    .json({ success: true, message: "Booking deleted successfully" });
};
