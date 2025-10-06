"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLocationZodSchemaValidation = exports.UpdateUserZodSchemaValidation = exports.RegisterSuccessZodSchemaValidation = exports.RegisterVerificationZodSchemaValidation = exports.RegisterRequestZodSchemaValidation = exports.vehicleInfoSchemaValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
const documentSchemaValidation = zod_1.default.object({
    drivingLicense: zod_1.default
        .string()
        .trim()
        .min(1, { message: "Driving license is required." })
        .optional(),
    nidOrPassport: zod_1.default
        .string()
        .trim()
        .min(1, { message: "NID or Passport is required." })
        .optional(),
    vehicleRegistration: zod_1.default
        .string()
        .trim()
        .min(1, { message: "Vehicle registration is required." })
        .optional(),
});
exports.vehicleInfoSchemaValidation = zod_1.default.object({
    vehicleLocation: zod_1.default
        .object({
        coordinates: zod_1.default.object({
            lat: zod_1.default.number().optional(),
            lng: zod_1.default.number().optional(),
        }),
        address: zod_1.default
            .string({
            error: () => {
                return "Invalid address!";
            },
        })
            .max(500, { message: "Address cannot exceed 500 characters." })
            .optional(),
    })
        .optional(),
    vehicleType: zod_1.default
        .string()
        .trim()
        .min(1, { message: "Vehicle type is required." })
        .optional(),
    vehicleModel: zod_1.default
        .string()
        .trim()
        .min(1, { message: "Vehicle model is required." })
        .optional(),
    vehicleNumberPlate: zod_1.default
        .string()
        .trim()
        .min(1, { message: "Vehicle number plate is required." })
        .optional(),
    documents: documentSchemaValidation.optional(),
});
const RegisterRequestZodSchemaValidation = zod_1.default.object({
    name: zod_1.default
        .string({
        error: (issue) => issue.input === undefined ? "Name is required" : "Invalid Name",
    })
        .min(2, {
        error: (issue) => {
            if (issue.code === "too_small") {
                return `Name must be ${issue.minimum} characters long!`;
            }
        },
    })
        .max(50, {
        error: (issue) => {
            if (issue.code === "too_big") {
                return `Name cannot exceed ${issue.minimum} characters!`;
            }
        },
    })
        .optional(),
    email: zod_1.default
        .email({
        error: (issue) => issue.input === undefined ? "Email is required" : "Invalid Email",
    })
        .min(5, {
        error: (issue) => {
            if (issue.code === "too_small") {
                return `Email must be ${issue.minimum} characters long!`;
            }
        },
    })
        .max(100, {
        error: (issue) => {
            if (issue.code === "too_big") {
                return `Email cannot exceed ${issue.minimum} characters!`;
            }
        },
    })
        .optional(),
});
exports.RegisterRequestZodSchemaValidation = RegisterRequestZodSchemaValidation;
const RegisterVerificationZodSchemaValidation = zod_1.default.object({
    otp: zod_1.default.string().min(6, "OTP must be at least 6 characters long"),
});
exports.RegisterVerificationZodSchemaValidation = RegisterVerificationZodSchemaValidation;
const RegisterSuccessZodSchemaValidation = zod_1.default.object({
    password: zod_1.default
        .string({
        error: (issue) => issue.input === undefined ? "Password is required" : "Invalid Password",
    })
        .min(8, {
        error: (issue) => {
            if (issue.code === "too_small") {
                return `Password must be ${issue.minimum} characters long!`;
            }
        },
    })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        error: () => {
            return "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character.";
        },
    }),
});
exports.RegisterSuccessZodSchemaValidation = RegisterSuccessZodSchemaValidation;
const UpdateUserZodSchemaValidation = zod_1.default.object({
    name: zod_1.default
        .string({
        error: (issue) => issue.input === undefined ? "Name is required" : "Invalid Name",
    })
        .min(2, {
        error: (issue) => {
            if (issue.code === "too_small") {
                return `Name must be ${issue.minimum} characters long!`;
            }
        },
    })
        .max(50, {
        error: (issue) => {
            if (issue.code === "too_big") {
                return `Name cannot exceed ${issue.minimum} characters!`;
            }
        },
    })
        .optional(),
    phone: zod_1.default
        .string({
        error: () => {
            return "Invalid Phone";
        },
    })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        error: () => {
            return "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX";
        },
    })
        .optional(),
    picture: zod_1.default
        .url({
        error: () => {
            return "Invalid url!";
        },
    })
        .optional(),
    role: zod_1.default
        .enum(user_interface_1.Role, {
        error: () => {
            return "Invalid Role.";
        },
    })
        .optional(),
    address: zod_1.default
        .string({
        error: () => {
            return "Invalid address!";
        },
    })
        .max(500, { message: "Address cannot exceed 500 characters." })
        .optional(),
    vehicleInfo: exports.vehicleInfoSchemaValidation.optional(),
    isOnline: zod_1.default
        .boolean({
        error: () => {
            return "isDriverApproved value must be true or false.";
        },
    })
        .optional(),
});
exports.UpdateUserZodSchemaValidation = UpdateUserZodSchemaValidation;
const UpdateLocationZodSchemaValidation = zod_1.default.object({
    address: zod_1.default
        .string({
        error: () => {
            return "Invalid address!";
        },
    })
        .max(500, { message: "Address cannot exceed 500 characters." })
        .optional(),
});
exports.UpdateLocationZodSchemaValidation = UpdateLocationZodSchemaValidation;
