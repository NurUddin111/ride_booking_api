"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_1 = require("../config/env");
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.creationToken) {
        res.cookie("creationToken", tokenInfo.creationToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production" ? true : false,
            sameSite: env_1.envVars.NODE_ENV === "production" ? "none" : "lax",
        });
    }
    if (tokenInfo.verifiedCreationToken) {
        res.clearCookie("creationToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.cookie("verifiedCreationToken", tokenInfo.verifiedCreationToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production" ? true : false,
            sameSite: env_1.envVars.NODE_ENV === "production" ? "none" : "lax",
        });
    }
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production" ? true : false,
            sameSite: env_1.envVars.NODE_ENV === "production" ? "none" : "lax",
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production" ? true : false,
            sameSite: env_1.envVars.NODE_ENV === "production" ? "none" : "lax",
        });
    }
    if (tokenInfo.forgotPassToken) {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.cookie("accessToken", tokenInfo.forgotPassToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production" ? true : false,
            sameSite: env_1.envVars.NODE_ENV === "production" ? "none" : "lax",
        });
    }
    if (tokenInfo.inActiveToken) {
        res.cookie("inActiveToken", tokenInfo.inActiveToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production" ? true : false,
            sameSite: env_1.envVars.NODE_ENV === "production" ? "none" : "lax",
        });
    }
    if (tokenInfo.blockedToken) {
        res.cookie("blockedToken", tokenInfo.blockedToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production" ? true : false,
            sameSite: env_1.envVars.NODE_ENV === "production" ? "none" : "lax",
        });
    }
};
exports.setAuthCookie = setAuthCookie;
