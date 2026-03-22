import { Request } from "express";

// User er role define kora
export type TUserRole = "USER" | "ADMIN";

// User schema er interface
export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: TUserRole;
  isDeleted: boolean;
}

// Auth middleware theke 'req.user' poyar jonno Request extend kora
export interface CustomRequest extends Request {
  user?: {
    id: string;
    role: TUserRole;
  };
}
