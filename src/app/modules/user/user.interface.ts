import { Types } from "mongoose";

enum Role {
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export enum VehicleType {
  CAR = "CAR",
  BIKE = "BIKE",
  CNG = "CNG",
  MICROBUS = "MICROBUS",
}

enum VehicleModel {
  BAJAJ = "BAJAJ",
  HONDA = "HONDA",
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

interface IDocuments extends IUser {
  drivingLicense: string;
  nidOrPassport: string;
  vehicleRegistration: string;
}

interface IVehicleInfo extends IUser {
  vehicleType: string;
  vehicleModel: VehicleModel;
  vehicleNumberPlate: string;
  vehicleLocation: {
    coordinates: {
      lng: number;
      lat: number;
    };
    address: string;
  };
  documents: IDocuments;
}

interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  role?: Role;
  vehicleInfo?: IVehicleInfo;
  isDriverApproved?: boolean;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  isOnline?: boolean;
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  penalties?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export { IUser, Role, IsActive, IAuthProvider, IDocuments, IVehicleInfo };
