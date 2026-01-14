import { Types } from "mongoose";

enum Role {
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export enum VehicleType {
  BIKE = "BIKE",
  CNG = "CNG",
  CAR = "CAR",
  MICROBUS = "MICROBUS",
}

export enum VehicleBrands {
  BAJAJ = "BAJAJ",
  HERO = "HERO",
  TVS = "TVS",
  SUZUKI = "SUZUKI",
  YAMAHA = "YAMAHA",
  PULSAR = "PULSAR",
  ROYAL_ENFIELD = "ROYAL_ENFIELD",
  KTM = "KTM",
  FZ = "FZ",
  TOYOTA = "TOYOTA",
  HYUNDAI = "HYUNDAI",
  BMW = "BMW",
  OMODA = "OMODA",
  MERCEDES_BENZ = "MERCEDES_BENZ",
  PIAGGIO = "PIAGGIO",
  MAHINDRA = "MAHINDRA",
  RUNNE = "RUNNE",
  NISSAN = "NISSAN",
  MITSUBISHI = "MITSUBISHI",
  MAZDA = "MAZDA",
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
  vehicleType: VehicleType;
  brand: VehicleBrands;
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
  isDeleted?: boolean;
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
