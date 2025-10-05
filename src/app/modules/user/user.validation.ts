import z from "zod";
import { Role } from "./user.interface";

const documentSchemaValidation = z.object({
  drivingLicense: z
    .string()
    .trim()
    .min(1, { message: "Driving license is required." })
    .optional(),
  nidOrPassport: z
    .string()
    .trim()
    .min(1, { message: "NID or Passport is required." })
    .optional(),
  vehicleRegistration: z
    .string()
    .trim()
    .min(1, { message: "Vehicle registration is required." })
    .optional(),
});

export const vehicleInfoSchemaValidation = z.object({
  vehicleLocation: z
    .object({
      coordinates: z.object({
        lat: z.number().optional(),
        lng: z.number().optional(),
      }),
      address: z
        .string({
          error: () => {
            return "Invalid address!";
          },
        })
        .max(500, { message: "Address cannot exceed 500 characters." })
        .optional(),
    })
    .optional(),
  vehicleType: z
    .string()
    .trim()
    .min(1, { message: "Vehicle type is required." })
    .optional(),
  vehicleModel: z
    .string()
    .trim()
    .min(1, { message: "Vehicle model is required." })
    .optional(),
  vehicleNumberPlate: z
    .string()
    .trim()
    .min(1, { message: "Vehicle number plate is required." })
    .optional(),

  documents: documentSchemaValidation.optional(),
});

const RegisterRequestZodSchemaValidation = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Name is required" : "Invalid Name",
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

  email: z
    .email({
      error: (issue) =>
        issue.input === undefined ? "Email is required" : "Invalid Email",
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

const RegisterVerificationZodSchemaValidation = z.object({
  otp: z.string().min(6, "OTP must be at least 6 characters long"),
});

const RegisterSuccessZodSchemaValidation = z.object({
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Password is required" : "Invalid Password",
    })
    .min(8, {
      error: (issue) => {
        if (issue.code === "too_small") {
          return `Password must be ${issue.minimum} characters long!`;
        }
      },
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        error: () => {
          return "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character.";
        },
      }
    ),
});

const UpdateUserZodSchemaValidation = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Name is required" : "Invalid Name",
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

  phone: z
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

  picture: z
    .url({
      error: () => {
        return "Invalid url!";
      },
    })
    .optional(),

  role: z
    .enum(Role, {
      error: () => {
        return "Invalid Role.";
      },
    })
    .optional(),

  address: z
    .string({
      error: () => {
        return "Invalid address!";
      },
    })
    .max(500, { message: "Address cannot exceed 500 characters." })
    .optional(),

  vehicleInfo: vehicleInfoSchemaValidation.optional(),

  isOnline: z
    .boolean({
      error: () => {
        return "isDriverApproved value must be true or false.";
      },
    })
    .optional(),
});

const UpdateLocationZodSchemaValidation = z.object({
  address: z
    .string({
      error: () => {
        return "Invalid address!";
      },
    })
    .max(500, { message: "Address cannot exceed 500 characters." })
    .optional(),
});

export {
  RegisterRequestZodSchemaValidation,
  RegisterVerificationZodSchemaValidation,
  RegisterSuccessZodSchemaValidation,
  UpdateUserZodSchemaValidation,
  UpdateLocationZodSchemaValidation,
};
