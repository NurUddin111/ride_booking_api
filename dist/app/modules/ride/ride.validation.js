"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRideZodSchema = exports.createRideZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("../user/user.interface");
const ride_interface_1 = require("./ride.interface");
exports.createRideZodSchema = zod_1.z.object({
    totalPassengers: zod_1.z.number().int().min(1, "At least one passenger required"),
    vehicleType: zod_1.z.enum(user_interface_1.VehicleType),
    pickUpAddress: zod_1.z
        .string()
        .min(3, "Address must be at least 3 characters long"),
    destinationAddress: zod_1.z
        .string()
        .min(3, "Address must be at least 3 characters long"),
});
exports.updateRideZodSchema = zod_1.z.object({
    status: zod_1.z.enum(ride_interface_1.RIDE_STATUS).optional(),
    otp: zod_1.z.string().min(6, "OTP must be at least 6 characters long").optional(),
});
