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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const httpStatusCodes_1 = require("../../utils/httpStatusCodes");
const createUserRequest = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    yield user_service_1.UserServices.createUserRequest(res, name, email);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: { email },
    });
}));
const createUserVerification = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const creationToken = req.cookies.creationToken;
    const { otp } = req.body;
    yield user_service_1.UserServices.createUserVerification(res, creationToken, otp);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully",
        data: null,
    });
}));
const createUserSuccess = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedCreationToken = req.cookies.verifiedCreationToken;
    const password = req.body.password;
    const payload = {
        password: password,
    };
    const user = yield user_service_1.UserServices.createUserSuccess(res, verifiedCreationToken, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: "User created successfully",
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const users = yield user_service_1.UserServices.getAllUsers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "All users retrieved successfully",
        data: users,
    });
}));
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield user_service_1.UserServices.getSingleUser(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "User retrieved successfully",
        data: user,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const result = yield user_service_1.UserServices.getMe(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user;
    const user = yield user_service_1.UserServices.updateUser(id, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "User updated successfully",
        data: user,
    });
}));
const becomeDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user;
    const user = yield user_service_1.UserServices.becomeDriver(id, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "Your request to be a driver is sent successfully!",
        data: user,
    });
}));
const becomeDriverRequests = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const result = yield user_service_1.UserServices.becomeDriverRequests(verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "Driver approval requests retrieved successfully!",
        data: result,
    });
}));
const approveDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const verifiedToken = req.user;
    const result = yield user_service_1.UserServices.approveDriver(id, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "Driver Approved!",
        data: result,
    });
}));
const getAllDrivers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const drivers = yield user_service_1.UserServices.getAllDrivers(verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "All drivers details retrieved successfully!",
        data: drivers,
    });
}));
const deleteUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield user_service_1.UserServices.deleteUser(id, res);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "User deleted successfully",
        data: user,
    });
}));
const updateVehicleLocation = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const address = req.body.address;
    const vehicleLocation = yield user_service_1.UserServices.setVehicleLocation(decodedToken, address);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.OK,
        message: "Driver Location Updated successfully",
        data: vehicleLocation,
    });
}));
exports.UserControllers = {
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
    updateVehicleLocation,
};
