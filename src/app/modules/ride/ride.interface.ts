import { Types } from "mongoose";
import { VehicleType } from "../user/user.interface";

export enum RIDE_STATUS {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  VEHICLE_ARRIVED = "VEHICLE_ARRIVED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED_BY_DRIVER = "CANCELLED_BY_DRIVER",
  CANCELLED_BY_RIDER = "CANCELLED_BY_RIDER",
  EXPIRED = "EXPIRED",
}

export interface IRide {
  riderId: Types.ObjectId;
  totalPassengers: number;
  driverId?: Types.ObjectId;
  vehicleType: VehicleType;

  pickupLocation: {
    coordinates: {
      lng: number;
      lat: number;
    };
    address?: string;
  };

  destinationLocation: {
    coordinates: {
      lng: number;
      lat: number;
    };
    address?: string;
  };

  status: RIDE_STATUS;
  distanceInKm: number;
  fareEstimate: {
    min: number;
    max: number;
  };
  rideHistory: {
    requestedAt: Date;
    acceptedAt?: Date;
    vehicleArrivedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    travellingTimeInMins?: number;
    totalFare?: number;
    cancelledAt?: Date;
  };
  createdAt: Date;
}
