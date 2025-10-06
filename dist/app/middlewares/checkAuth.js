"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const httpStatusCodes_1 = require("../utils/httpStatusCodes");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const checkUserStatus_1 = require("../utils/checkUserStatus");
const user_interface_1 = require("../modules/user/user.interface");
const checkAuth = (...authRoles) => (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, "No access token received.Please login get new access token...");
    }
    const verifiedAccessToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
    const userRole = verifiedAccessToken.role;
    const userId = verifiedAccessToken.userId;
    if (!authRoles.includes(userRole)) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, "You are not permitted to view this route!!!");
    }
    if (userRole === user_interface_1.Role.DRIVER) {
        const driverId = userId;
        const driver = (yield user_model_1.User.findById(driverId));
        if (!driver.vehicleInfo) {
            throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "You aren't authorized since you haven't submitted your vehicle information!");
        }
        if (driver.vehicleInfo && !driver.isDriverApproved) {
            throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Your vehicle details are pending approval. You'll be able to perform this action once approved. Please review and update if needed.");
        }
    }
    const email = verifiedAccessToken.email;
    const user = (yield user_model_1.User.findOne({ email }));
    (0, checkUserStatus_1.checkUserStatus)(req, user, email);
    req.user = verifiedAccessToken;
    next();
}));
exports.checkAuth = checkAuth;
