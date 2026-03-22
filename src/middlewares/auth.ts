import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { User } from "../models/user.model";

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      // ১. চেক করা টোকেন পাঠানো হয়েছে কি না
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized! Token missing.",
        });
      }

      // ২. টোকেনটি ভ্যালিড কি না চেক করা
      let decoded;
      try {
        decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or Expired Token!",
        });
      }

      const { role, email } = decoded;

      // ৩. ডাটাবেসে ইউজারটি এখনো আছে কি না চেক করা
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "This user is not found!",
        });
      }

      // ৪. রোল চেক করা (Authorization)
      // যদি requiredRoles এ কিছু পাঠানো হয়, তবেই চেক করবে
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        return res.status(401).json({
          success: false,
          message: "You have no permission to access this route!",
        });
      }

      // ৫. ইউজার ডাটা রিকোয়েস্টে সেট করা যাতে কন্ট্রোলারে 'req.user' পাওয়া যায়
      req.user = decoded as JwtPayload;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong in Auth Middleware",
      });
    }
  };
};

export default auth;
