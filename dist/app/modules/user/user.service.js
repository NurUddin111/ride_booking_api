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
exports.UserServices = void 0;
const env_1 = require("./../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const httpStatusCodes_1 = require("../../utils/httpStatusCodes");
const setCookie_1 = require("../../utils/setCookie");
const otp_service_1 = require("../otp/otp.service");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const jwt_1 = require("../../utils/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const redis_service_1 = require("../redis/redis.service");
const geoApiFy_1 = require("../../utils/geoApiFy");
const user_constants_1 = require("./user.constants");
const queryBuilder_1 = require("../../utils/queryBuilder");
const createUserRequest = (res, name, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Please Enter Your Name");
    }
    if (!email) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Please enter a valid email address!");
    }
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "User already exists");
    }
    const sub = "Account Verification Code";
    const temp = "accountVerificationOtp";
    const tempData = {
        name,
    };
    const OTP_EXPIRATION = 2 * 60;
    yield otp_service_1.OTPServices.sendOTP(email, sub, temp, tempData, OTP_EXPIRATION);
    const jwtPayload = {
        name: name,
        email: email,
    };
    const creationToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_CREATION_SECRET, env_1.envVars.JWT_CREATION_EXPIRES);
    if (!creationToken) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to create CREATION_TOKEN");
    }
    (0, setCookie_1.setAuthCookie)(res, { creationToken: creationToken });
});
const createUserVerification = (res, creationToken, otp) => __awaiter(void 0, void 0, void 0, function* () {
    if (!creationToken) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, "No CREATION_TOKEN recieved");
    }
    const verifiedToken = (0, jwt_1.verifyToken)(creationToken, env_1.envVars.JWT_CREATION_SECRET);
    const { name, email } = verifiedToken;
    if (!name || !email) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to decode Name and Email from CREATION_TOKEN");
    }
    yield otp_service_1.OTPServices.verifyOTP(email, otp);
    const jwtPayload = {
        name: name,
        email: email,
    };
    const verifiedCreationToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_VERIFIED_CREATION_SECRET, env_1.envVars.JWT_VERIFIED_CREATION_EXPIRES);
    if (!verifiedCreationToken) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to create VERIFIED_CREATION_TOKEN");
    }
    (0, setCookie_1.setAuthCookie)(res, { verifiedCreationToken: verifiedCreationToken });
});
const createUserSuccess = (res, verifiedCreationToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!verifiedCreationToken) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, "No VERIFIED_CREATION_TOKEN received.Please verify your email first!");
    }
    const verifiedToken = (0, jwt_1.verifyToken)(verifiedCreationToken, env_1.envVars.JWT_CREATION_SECRET);
    const { name, email } = verifiedToken;
    if (!name || !email) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to decode Name and Email from VERIFIED_CREATION_TOKEN");
    }
    const { password } = payload, rest = __rest(payload, ["password"]);
    if (!password) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, "Plase set a password");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ name,
        email, password: hashedPassword, auths: [authProvider], isVerified: true }, rest));
    res.clearCookie("verifiedCreationToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    return user;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const usersData = queryBuilder
        .filter()
        .search(user_constants_1.userSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        usersData.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = user_model_1.User.findById(userId);
    return user;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "User not found");
    }
    return {
        data: user,
    };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "User Not Found");
    }
    if (decodedToken.role === user_interface_1.Role.RIDER || decodedToken.role === user_interface_1.Role.DRIVER) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.default(401, "It looks like you're trying to edit another user's profile. You can only make changes to your own profile.");
        }
    }
    if (payload.role && payload.role === user_interface_1.Role.ADMIN) {
        if (decodedToken.role !== user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.FORBIDDEN, "Setting up Admin role is a restricted action. For security, only users with an existing Admin role can assign it to others.");
        }
    }
    if (payload.role && payload.role === user_interface_1.Role.DRIVER) {
        if (((_a = payload.vehicleInfo) === null || _a === void 0 ? void 0 : _a.vehicleInfo) === undefined) {
            throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "If you want to update your role to DRIVER,you must have to give your vehicle information");
        }
    }
    if (((_b = payload.vehicleInfo) === null || _b === void 0 ? void 0 : _b.vehicleInfo) !== undefined &&
        payload.role !== user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "If you want to submit your vehicle information,please select your role as driver");
    }
    if (payload.isDriverApproved && decodedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "You can't set your driving approval status by yourself.Please submit your vehicle information or if you have already submitted then plese wait for 1-2 business days. We will inform after we finish checking your vehicle information.");
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role !== user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.FORBIDDEN, "This is a restricted action. For security, only Admin can update these information.");
        }
    }
    if (payload.isOnline && !user.isDriverApproved) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.FORBIDDEN, "You can set your availibility status after you get driver approval only.");
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedUser;
});
const becomeDriver = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "User Not Found");
    }
    if (userId !== decodedToken.userId) {
        throw new AppError_1.default(401, "You can only send become a driver request for yourself!");
    }
    if (payload.vehicleInfo === undefined) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Please submit your vehicle information!");
    }
    payload = Object.assign({ isDriverApproved: false }, payload);
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedUser;
});
const becomeDriverRequests = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = decodedToken;
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "User Not Found");
    }
    const pendingDriverRequests = yield user_model_1.User.find({
        isDriverApproved: false,
    });
    return pendingDriverRequests;
});
const approveDriver = (id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = decodedToken;
    const admin = yield user_model_1.User.findById(userId);
    if (!admin) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Admin Not Found");
    }
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "User Not Found");
    }
    const payload = {
        role: user_interface_1.Role.DRIVER,
        isDriverApproved: true,
    };
    const approvedDriver = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return approvedDriver;
});
const getAllDrivers = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = decodedToken;
    const admin = yield user_model_1.User.findById(userId);
    if (!admin) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Admin Not Found");
    }
    const drivers = yield user_model_1.User.find({
        role: user_interface_1.Role.DRIVER,
        isDriverApproved: true,
    });
    return drivers;
});
const deleteUser = (userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist || isUserExist.isDeleted) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "User Not Found");
    }
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { isDeleted: true }, {
        new: true,
    });
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
    return user;
});
const setVehicleLocation = (decodedToken, address) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = decodedToken.userId;
    const driver = (yield user_model_1.User.findById(driverId));
    const vehicleInfo = driver.vehicleInfo;
    if (!vehicleInfo) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "No Vehicle Info found");
    }
    const addressCo = yield (0, geoApiFy_1.geocodeAddress)(address);
    if (!addressCo) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Sorry! Couldn't find your location");
    }
    const lng = Number(addressCo.longitude);
    const lat = Number(addressCo.latitude);
    yield redis_service_1.RedisServices.setVehicleLocation(driverId, lng, lat);
    vehicleInfo.vehicleLocation = {
        coordinates: {
            lng: addressCo.longitude,
            lat: addressCo.latitude,
        },
        address: addressCo.address,
    };
    yield driver.save();
    return { driver };
});
exports.UserServices = {
    createUserRequest,
    createUserVerification,
    createUserSuccess,
    getAllUsers,
    getSingleUser,
    getMe,
    updateUser,
    becomeDriver,
    becomeDriverRequests,
    approveDriver,
    getAllDrivers,
    deleteUser,
    setVehicleLocation,
};
