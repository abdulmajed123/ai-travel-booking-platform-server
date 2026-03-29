import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from ".";
import User from "../models/user.model";
import crypto from "crypto";

// Serialize User: সেশন ব্যবহারের জন্য (যদিও আমরা JWT ব্যবহার করছি, এটি রাখা ভালো)
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Google Strategy Configuration
if (config.google_client_id && config.google_client_secret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google_client_id,
        clientSecret: config.google_client_secret,
        callbackURL: `${config.server_url}/api/v1/auth/google/callback`,
        passReqToCallback: true, // রিকোয়েস্ট অবজেক্ট এক্সেস করার জন্য
      },
      async (_req, _accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("No email found from Google account"), false);
          }

          // ১. প্রথমে googleId দিয়ে চেক করুন
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // ২. যদি googleId না থাকে, তবে ইমেইল দিয়ে চেক করুন (আগে রেজিস্টার্ড কি না)
            user = await User.findOne({ email });

            if (user) {
              // ইমেইল মিলে গেলে শুধু googleId এবং avatar আপডেট করুন
              user.googleId = profile.id;
              if (profile.photos?.[0]?.value) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            } else {
              // ৩. একদম নতুন ইউজার হলে ডাটাবেজে তৈরি করুন
              user = await User.create({
                name: profile.displayName,
                email: email,
                googleId: profile.id,
                avatar: profile.photos?.[0]?.value,
                isVerified: true,
                role: "user", // CRITICAL: এটি অবশ্যই দিন যাতে JWT জেনারেট করার সময় এরর না দেয়
                password: crypto.randomBytes(32).toString("hex"), // র‍্যান্ডম পাসওয়ার্ড
              });
            }
          }

          return done(null, user);
        } catch (err) {
          console.error("Google Strategy Error:", err);
          return done(err as Error, false);
        }
      },
    ),
  );
} else {
  console.warn("Google Client ID or Secret is missing in config!");
}

export default passport;
