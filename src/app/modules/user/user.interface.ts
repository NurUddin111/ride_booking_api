import { Types } from "mongoose";

enum Role {
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  isOnline?: boolean;
  vehicle?: string;
  role: Role;
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export { IUser, Role, IsActive, IAuthProvider };
