import { Request, Response } from "express";
import { Booking } from "../models/booking.model";
import AppError from "../utils/AppError";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { itemId, quantity, price } = req.body;
    const user = req.user as any; // Type casting to bypass TS error

    const userId = user?.id || user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "ইউজার অথেন্টিকেশন পাওয়া যায়নি!",
      });
    }

    const newBooking = await Booking.create({
      userId,
      itemId,
      quantity,
      price,
    });

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("userId", "name email")
      .populate("itemId");

    res.status(201).json({
      success: true,
      message: "বুকিং সফলভাবে সম্পন্ন হয়েছে",
      data: populatedBooking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "সার্ভারে সমস্যা হয়েছে",
    });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const role = user?.role;
    const id = user?.id || user?._id;

    let query = {};
    if (role !== "admin") {
      query = { userId: id };
    }

    const bookings = await Booking.find(query)
      .populate("userId", "name email")
      .populate("itemId");

    res.status(200).json({ success: true, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!booking) throw new AppError("Booking not found", 404);
    res.status(200).json({ success: true, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) throw new AppError("Booking not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
