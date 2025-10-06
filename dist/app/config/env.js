"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnvVariables = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",
        "BCRYPT_SALT_ROUND",
        "JWT_CREATION_SECRET",
        "JWT_CREATION_EXPIRES",
        "JWT_VERIFIED_CREATION_SECRET",
        "JWT_VERIFIED_CREATION_EXPIRES",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRES",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",
        "EXPRESS_SESSION_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "FRONTEND_URL",
        "SMTP_PASS",
        "SMTP_PORT",
        "SMTP_HOST",
        "SMTP_USER",
        "SMTP_FROM",
        "REDIS_USERNAME",
        "REDIS_PASSWORD",
        "REDIS_HOST",
        "REDIS_PORT",
        "GEOAPIFY_API_KEY",
    ];
    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        JWT_CREATION_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_CREATION_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
        JWT_VERIFIED_CREATION_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_VERIFIED_CREATION_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        EMAIL_SENDER: {
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASS: process.env.SMTP_PASS,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_FROM: process.env.SMTP_FROM,
        },
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT,
        GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY,
    };
};
exports.envVars = loadEnvVariables();
