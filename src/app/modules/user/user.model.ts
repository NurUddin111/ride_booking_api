import { model, Schema } from "mongoose";
import {
  IAuthProvider,
  IDocuments,
  IsActive,
  IUser,
  IVehicleInfo,
  Role,
  VehicleType,
} from "./user.interface";
import { bdTimePlugin } from "../../middlewares/fomatTime";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const documentsSchema = new Schema<IDocuments>(
  {
    drivingLicense: {
      type: String,
      default: null,
      required: function () {
        return this.role === Role.DRIVER;
      },
    },

    nidOrPassport: {
      type: String,
      default: null,
      required: function () {
        return this.role === Role.DRIVER;
      },
    },

    vehicleRegistration: {
      type: String,
      default: null,
      required: function () {
        return this.role === Role.DRIVER;
      },
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const vehicleInfoSchema = new Schema<IVehicleInfo>(
  {
    vehicleType: {
      type: String,
      enum: Object.values(VehicleType),
      default: null,
      required: function () {
        return this.role === Role.DRIVER;
      },
    },

    vehicleModel: {
      type: String,
      default: null,
      required: function () {
        return this.role === Role.DRIVER;
      },
    },

    vehicleNumberPlate: {
      type: String,
      default: null,
      required: function () {
        return this.role === Role.DRIVER;
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
  },
  {
    _id: false,
    versionKey: false,
  }
);

const userSchema = new Schema<IUser>(
  {
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
      enum: Object.values(Role),
      default: Role.RIDER,
    },
    phone: { type: String, default: null },
    picture: { type: String, default: null },
    address: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },

    vehicleInfo: { type: vehicleInfoSchema, default: null },
    isDriverApproved: { type: Boolean, default: false },

    auths: [authProviderSchema],
    bookings: {
      type: [{ type: Schema.Types.ObjectId, ref: "Ride" }],
    },
    penalties: { type: Number, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.plugin(bdTimePlugin);

export const User = model<IUser>("User", userSchema);
