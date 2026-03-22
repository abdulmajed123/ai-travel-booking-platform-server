import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  googleId?: string;
  avatar?: string;
  isVerified?: boolean;
  comparePassword?: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" },
    googleId: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Password hash (Mongoose 7+ compatible)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const saltRounds = Number(config.bcrypt_salt_rounds || 12);
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
