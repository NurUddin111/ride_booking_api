"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const env_1 = require("./env");
const passport_1 = __importDefault(require("passport"));
const checkUserStatus_1 = require("../utils/checkUserStatus");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield user_model_1.User.findOne({ email }).select("+password"));
        if (!user) {
            return done(null, false, {
                message: "No account found with this email",
            });
        }
        if (user.isDeleted) {
            return done(null, false, {
                message: "User is deleted!",
            });
        }
        if (!user.isVerified) {
            return done(null, false, {
                message: "User is not verified!",
            });
        }
        const isGoogleAuthenticated = user.auths.some((providerObject) => providerObject.provider === "google");
        if (isGoogleAuthenticated && !user.password) {
            return done(null, false, {
                message: "The email address you entered is associated with an account created using 'Log in with Google'. To access your account, please click the Google button. If you'd like to set a password for future logins, you can do so in your account settings after logging in.",
            });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatched) {
            return done(null, false, { message: "Incorrect Password" });
        }
        return done(null, user);
    }
    catch (error) {
        console.error(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
}, (req, accessToken, refreshToke, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let email;
        if (profile.emails && profile.emails.length > 0) {
            email = (_a = profile.emails.find((email) => email.verified)) === null || _a === void 0 ? void 0 : _a.value;
        }
        else {
            return done(null, false, { message: "Email Not Found" });
        }
        let user = (yield user_model_1.User.findOne({ email }).select("+password"));
        if (!user) {
            user = yield user_model_1.User.create({
                name: profile.displayName,
                email,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                role: user_interface_1.Role.RIDER,
                isVerified: true,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id,
                    },
                ],
            });
            return done(null, user);
        }
        (0, checkUserStatus_1.checkUserStatus)(req, user, email);
        const isCredentialsAuthenticated = user.auths.some((providerObject) => providerObject.provider === "credentials");
        if (isCredentialsAuthenticated) {
            return done(null, false, {
                message: `An account with ${user.email} already exists. Please sign in with your email and password to link your Google account to your profile.`,
            });
        }
        return done(null, user);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
