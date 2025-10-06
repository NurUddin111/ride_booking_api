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
exports.checkUserStatus = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const httpStatusCodes_1 = require("./httpStatusCodes");
const user_interface_1 = require("../modules/user/user.interface");
const jwt_1 = require("./jwt");
const checkUserStatus = (req, user, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "User does not exist");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.FORBIDDEN, "User is deleted");
    }
    if (!user.isVerified) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.FORBIDDEN, "User is not verified");
    }
    const blockedToken = req.cookies.blockedToken;
    const inActiveToken = req.cookies.inActiveToken;
    if (blockedToken) {
        const verifiedBlockedToken = (0, jwt_1.verifyToken)(blockedToken, email);
        if (!verifiedBlockedToken) {
            user.isActive = user_interface_1.IsActive.ACTIVE;
            yield user.save();
        }
    }
    if (!blockedToken && user.isActive === user_interface_1.IsActive.BLOCKED) {
        user.isActive = user_interface_1.IsActive.ACTIVE;
        yield user.save();
    }
    if (inActiveToken) {
        const verifiedInActiveToken = (0, jwt_1.verifyToken)(inActiveToken, email);
        if (verifiedInActiveToken) {
            user.isActive = user_interface_1.IsActive.ACTIVE;
            yield user.save();
        }
    }
    if (user.isActive === user_interface_1.IsActive.BLOCKED) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.FORBIDDEN, `User is ${user.isActive}`);
    }
});
exports.checkUserStatus = checkUserStatus;
