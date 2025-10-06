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
exports.AuthServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userTokens_1 = require("../../utils/userTokens");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const httpStatusCodes_1 = require("../../utils/httpStatusCodes");
const env_1 = require("../../config/env");
const checkUserStatus_1 = require("../../utils/checkUserStatus");
const sendEmail_1 = require("../../utils/sendEmail");
const setCookie_1 = require("../../utils/setCookie");
const jwt_1 = require("../../utils/jwt");
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userTokens_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken,
        refreshToken,
    };
});
const changePassword = (oldPass, newPass, confirmNewPass, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield user_model_1.User.findById(decodedToken.userId).select("+password"));
    if (!user.password) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "User don't have a password.Please set a password first.");
    }
    if (!oldPass) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Please provide current password.");
    }
    if (!newPass) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Please provide a new password.");
    }
    if (!confirmNewPass) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Please provide confirmed password.");
    }
    const oldPassMatching = yield bcryptjs_1.default.compare(oldPass, user.password);
    if (!oldPassMatching) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, "Old Password does not match");
    }
    if (oldPass === newPass) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Please set a new password!");
    }
    if (newPass !== confirmNewPass) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "New password and confirmation do not match.");
    }
    user.password = yield bcryptjs_1.default.hash(newPass, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    yield user.save();
});
const setPassword = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("+password");
    if (!user) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "User not found");
    }
    if (user.password) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "You have already set your password. Now you can change the password from your profile password update");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const credentialProvider = {
        provider: "credentials",
        providerId: user.email,
    };
    const auths = [...user.auths, credentialProvider];
    user.password = hashedPassword;
    user.auths = auths;
    yield user.save();
});
const forgotPassword = (req, res, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield user_model_1.User.findOne({ email }).select("+password"));
    (0, checkUserStatus_1.checkUserStatus)(req, user, email);
    if (!user.password) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "You didn't set any password previously.");
    }
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const resetToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, "10m");
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;
    yield (0, sendEmail_1.sendEmail)({
        to: user.email,
        subject: "Forgot Password?",
        templateName: "forgotPassword",
        templateData: {
            name: user.name,
            resetUILink,
        },
    });
    (0, setCookie_1.setAuthCookie)(res, { forgotPassToken: resetToken });
});
const resetPassword = (res, userId, newPass, confirmNewPass, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId != decodedToken.userId) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, "Sorry! You can reset only your password.");
    }
    const user = (yield user_model_1.User.findById(decodedToken.userId).select("+password"));
    if (!newPass) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Please provide a new password.");
    }
    if (!confirmNewPass) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Please provide confirmed password.");
    }
    if (newPass !== confirmNewPass) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "New password and confirmation does not match.");
    }
    user.password = yield bcryptjs_1.default.hash(newPass, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    yield user.save();
    yield res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
});
exports.AuthServices = {
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
};
