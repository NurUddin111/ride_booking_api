"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const user_interface_1 = require("../user/user.interface");
const fomatTime_1 = require("../../middlewares/fomatTime");
const rideSchema = new mongoose_1.Schema({
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    totalPassengers: { type: Number, required: true },
    vehicleType: {
        type: String,
        enum: Object.values(user_interface_1.VehicleType),
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
        enum: Object.values(ride_interface_1.RIDE_STATUS),
        required: true,
        default: ride_interface_1.RIDE_STATUS.PENDING,
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
}, { timestamps: true, versionKey: false });
rideSchema.plugin(fomatTime_1.bdTimePlugin);
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
