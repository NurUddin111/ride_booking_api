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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const httpStatusCodes_1 = require("../../utils/httpStatusCodes");
const passport_1 = __importDefault(require("passport"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const userTokens_1 = require("../../utils/userTokens");
const setCookie_1 = require("../../utils/setCookie");
const env_1 = require("../../config/env");
const auth_service_1 = require("./auth.service");
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, err));
        }
        if (!user) {
            return next(new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, info.message));
        }
        const userTokens = (0, userTokens_1.createUserTokens)(user);
        const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        (0, setCookie_1.setAuthCookie)(res, userTokens);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
            message: "User logged in successfully",
            data: {
                acceessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest,
            },
        });
    }))(req, res, next);
}));
const googleLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })(req, res, next);
}));
const googleCallback = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("google", {
        failureRedirect: `${env_1.envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!`,
        session: true,
    }, (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, err));
        }
        if (!user) {
            console.error("Authentication failed:", info.message);
            return res.status(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                success: false,
                message: info.message,
            });
        }
        req.login(user, (loginErr) => __awaiter(void 0, void 0, void 0, function* () {
            if (loginErr) {
                return next(new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, err));
            }
            const tokenInfo = (0, userTokens_1.createUserTokens)(user);
            (0, setCookie_1.setAuthCookie)(res, tokenInfo);
            res.redirect(`${env_1.envVars.FRONTEND_URL}`);
        }));
    }))(req, res, next);
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "No refresh token recieved from cookies");
    }
    const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "User Logged Out Successfully",
        data: null,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    const confirmNewPass = req.body.confirmNewPass;
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.changePassword(oldPass, newPass, confirmNewPass, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "Password Changed Successfully",
        data: null,
    });
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.setPassword(decodedToken.userId, password);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "Password Set Successfully",
        data: null,
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    yield auth_service_1.AuthServices.forgotPassword(req, res, email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "Email Sent Successfully",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const newPass = req.body.newPass;
    const confirmNewPass = req.body.confirmNewPass;
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.resetPassword(res, userId, newPass, confirmNewPass, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "Password Changed Successfully.Please login with new password",
        data: null,
    });
}));
exports.AuthControllers = {
    credentialsLogin,
    googleLogin,
    googleCallback,
    getNewAccessToken,
    logout,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
};
