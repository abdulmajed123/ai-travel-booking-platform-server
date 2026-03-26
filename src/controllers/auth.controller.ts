import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import AppError from "../utils/AppError";
import passport from "../config/passport";

const generateTokens = (payload: any) => ({
  accessToken: jwt.sign(payload, config.jwt_secret, {
    expiresIn: config.jwt_expires_in,
  }),
  refreshToken: jwt.sign(payload, config.jwt_refresh_secret, {
    expiresIn: config.jwt_refresh_expires_in,
  }),
});

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role, avatar } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("User already exists", 400);

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar,
    isVerified: true,
  });
  const tokens = generateTokens({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  res.status(201).json({ success: true, user, ...tokens });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid email or password", 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError("Invalid email or password", 401);

  const tokens = generateTokens({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  res.status(200).json({ success: true, user, ...tokens });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError("Refresh token required", 400);

  try {
    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret) as any;
    const tokens = generateTokens({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });
    res.status(200).json({ success: true, ...tokens });
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }
};

// Google OAuth
export const googleAuth = (req: Request, res: Response, next: any) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
};

export const googleCallback = (req: Request, res: Response) => {
  passport.authenticate(
    "google",
    {
      session: false,
      failureRedirect: `${config.client_url}/login?error=google_failed`,
    },
    (err, user) => {
      if (err || !user)
        return res.redirect(`${config.client_url}/login?error=google_failed`);

      // টোকেন জেনারেট করা
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.jwt_secret,
        { expiresIn: config.jwt_expires_in },
      );

      // এখানে পরিবর্তন করুন: /auth/callback মুছে দিন
      // এখন এটি ইউজারকে সরাসরি http://localhost:3000/?accessToken=... এ পাঠাবে
      res.redirect(`${config.client_url}/?accessToken=${token}`);
    },
  )(req, res);
};

// import { Request, Response } from "express";
// import User from "../models/user.model";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import config from "../config";
// import AppError from "../utils/AppError";
// import passport from "../config/passport";

// const generateTokens = (payload: any) => ({
//   accessToken: jwt.sign(payload, config.jwt_secret, {
//     expiresIn: config.jwt_expires_in,
//   }),
//   refreshToken: jwt.sign(payload, config.jwt_refresh_secret, {
//     expiresIn: config.jwt_refresh_expires_in,
//   }),
// });

// export const register = async (req: Request, res: Response) => {
//   const { name, email, password, role, avatar } = req.body;

//   const existing = await User.findOne({ email });
//   if (existing) throw new AppError("User already exists", 400);

//   const user = await User.create({
//     name,
//     email,
//     password,
//     role,
//     avatar,
//     isVerified: true,
//   });

//   const tokens = generateTokens({
//     id: user._id,
//     email: user.email,
//     role: user.role,
//   });

//   res.status(201).json({ success: true, user, ...tokens });
// };

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email }).select("+password");
//   if (!user) throw new AppError("Invalid email or password", 401);

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) throw new AppError("Invalid email or password", 401);

//   const tokens = generateTokens({
//     id: user._id,
//     email: user.email,
//     role: user.role,
//   });

//   res.status(200).json({ success: true, user, ...tokens });
// };

// export const refreshToken = async (req: Request, res: Response) => {
//   const { refreshToken } = req.body;

//   if (!refreshToken) throw new AppError("Refresh token required", 400);

//   try {
//     const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret) as any;

//     const tokens = generateTokens({
//       id: decoded.id,
//       email: decoded.email,
//       role: decoded.role,
//     });

//     res.status(200).json({ success: true, ...tokens });
//   } catch {
//     throw new AppError("Invalid or expired refresh token", 401);
//   }
// };

// //
// // ================= GOOGLE OAUTH =================
// //

// export const googleAuth = (req: Request, res: Response, next: any) => {
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     session: false,
//   })(req, res, next);
// };

// export const googleCallback = (req: Request, res: Response) => {
//   passport.authenticate(
//     "google",
//     {
//       session: false,
//       failureRedirect: `${config.client_url}/login?error=google_failed`,
//     },
//     (err, user) => {
//       if (err || !user) {
//         return res.redirect(`${config.client_url}/login?error=google_failed`);
//       }

//       // ✅ Token generate
//       const token = jwt.sign(
//         {
//           id: user._id,
//           email: user.email,
//           role: user.role,
//         },
//         config.jwt_secret,
//         { expiresIn: config.jwt_expires_in },
//       );

//       // ✅ User data
//       const userData = {
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar || user.photo || user.photos?.[0]?.value,
//       };

//       // ✅ Redirect with token + user
//       res.redirect(
//         `${config.client_url}/?accessToken=${token}&user=${encodeURIComponent(
//           JSON.stringify(userData),
//         )}`,
//       );
//     },
//   )(req, res);
// };
