import z from "zod";
import { IsActive, Role } from "./user.interface";

const CreateUserZodValidation = z.object({
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
    }),

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
    }),

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

  address: z
    .string({
      error: () => {
        return "Invalid address!";
      },
    })
    .optional(),

  vehicle: z
    .string({
      error: () => {
        return "Invalid vehicle!";
      },
    })
    .optional(),

  role: z
    .enum(Role, {
      error: () => {
        return "Invalid Role";
      },
    })
    .refine((val) => val !== Role.ADMIN, {
      error: () => {
        return "You are not authorized to assign the ADMIN role.";
      },
    })
    .optional(),
});

const UpdateUserZodValidation = z.object({
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
  isActive: z
    .enum(IsActive, {
      error: () => {
        return "Invalid Role.";
      },
    })
    .optional(),
  isDeleted: z
    .boolean({
      error: () => {
        return "isDeleted must be true or false.";
      },
    })
    .optional(),
  isVerified: z
    .boolean({
      error: () => {
        return "isVerified must be true or false.";
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

  vehicle: z
    .string({
      error: () => {
        return "Invalid vehicle!";
      },
    })
    .optional(),
});

export { CreateUserZodValidation, UpdateUserZodValidation };
