import { Schema, model } from "mongoose";
import { IRide, RIDE_STATUS } from "./ride.interface";
import { VehicleType } from "../user/user.interface";
import { bdTimePlugin } from "../../middlewares/fomatTime";

const rideSchema = new Schema<IRide>(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    totalPassengers: { type: Number, required: true },

    vehicleType: {
      type: String,
      enum: Object.values(VehicleType),
      required: true,
    },

    pickupLocation: {
      coordinates: {
        lng: { type: Number, required: true },
        lat: { type: Number, required: true },
      },
      address: { type: String, required: true },
    },

    destinationLocation: {
      coordinates: {
        lng: { type: Number, required: true },
        lat: { type: Number, required: true },
      },
      address: { type: String, required: true },
    },

    status: {
      type: String,
      enum: Object.values(RIDE_STATUS),
      required: true,
      default: RIDE_STATUS.PENDING,
    },

    distanceInKm: { type: Number, required: true },
    fareEstimate: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    rideHistory: {
      requestedAt: { type: Date, required: true, default: Date.now },
      acceptedAt: { type: Date, default: null },
      vehicleArrivedAt: { type: Date, default: null },
      startedAt: { type: Date, default: null },
      completedAt: { type: Date, default: null },
      travellingTimeInMins: { type: Number, default: null },
      totalFare: { type: Number, default: null },
      cancelledAt: { type: Date, default: null },
    },
  },
  { timestamps: true, versionKey: false }
);

rideSchema.plugin(bdTimePlugin);

export const Ride = model<IRide>("Ride", rideSchema);
