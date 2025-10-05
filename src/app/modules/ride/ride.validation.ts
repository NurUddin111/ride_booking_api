import { z } from "zod";
import { VehicleType } from "../user/user.interface";
import { RIDE_STATUS } from "./ride.interface";

export const createRideZodSchema = z.object({
  totalPassengers: z.number().int().min(1, "At least one passenger required"),
  vehicleType: z.enum(VehicleType),
  pickUpAddress: z
    .string()
    .min(3, "Address must be at least 3 characters long"),
  destinationAddress: z
    .string()
    .min(3, "Address must be at least 3 characters long"),
});

export const updateRideZodSchema = z.object({
  status: z.enum(RIDE_STATUS).optional(),
  otp: z.string().min(6, "OTP must be at least 6 characters long").optional(),
});
