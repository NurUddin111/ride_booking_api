"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const fomatTime_1 = require("../../middlewares/fomatTime");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    versionKey: false,
    _id: false,
});
const documentsSchema = new mongoose_1.Schema({
    drivingLicense: {
        type: String,
        default: null,
        required: function () {
            return this.role === user_interface_1.Role.DRIVER;
        },
    },
    nidOrPassport: {
        type: String,
        default: null,
        required: function () {
            return this.role === user_interface_1.Role.DRIVER;
        },
    },
    vehicleRegistration: {
        type: String,
        default: null,
        required: function () {
            return this.role === user_interface_1.Role.DRIVER;
        },
    },
}, {
    _id: false,
    versionKey: false,
});
const vehicleInfoSchema = new mongoose_1.Schema({
    vehicleType: {
        type: String,
        enum: Object.values(user_interface_1.VehicleType),
        default: null,
        required: function () {
            return this.role === user_interface_1.Role.DRIVER;
        },
    },
    vehicleModel: {
        type: String,
        default: null,
        required: function () {
            return this.role === user_interface_1.Role.DRIVER;
        },
    },
    vehicleNumberPlate: {
        type: String,
        default: null,
        required: function () {
            return this.role === user_interface_1.Role.DRIVER;
        },
    },
    vehicleLocation: {
        coordinates: {
            lng: {
                type: Number,
                default: null,
                required: function () {
                    return this.isDriverApproved === true;
                },
            },
            lat: {
                type: Number,
                default: null,
                required: function () {
                    return this.isDriverApproved === true;
                },
            },
        },
        address: {
            type: String,
            default: null,
            required: function () {
                return this.isDriverApproved === true;
            },
        },
    },
    documents: { type: documentsSchema, default: null },
}, {
    _id: false,
    versionKey: false,
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        select: false,
        default: null,
        required() {
            return this.auths[0].provider === "credentials";
        },
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.RIDER,
    },
    phone: { type: String, default: null },
    picture: { type: String, default: null },
    address: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    vehicleInfo: { type: vehicleInfoSchema, default: null },
    isDriverApproved: { type: Boolean, default: false },
    auths: [authProviderSchema],
    bookings: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Ride" }],
    },
    penalties: { type: Number, default: null },
}, {
    timestamps: true,
    versionKey: false,
});
userSchema.plugin(fomatTime_1.bdTimePlugin);
exports.User = (0, mongoose_1.model)("User", userSchema);
