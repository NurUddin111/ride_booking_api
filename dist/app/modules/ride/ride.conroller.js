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
exports.RideControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const httpStatusCodes_1 = require("../../utils/httpStatusCodes");
const ride_service_1 = require("./ride.service");
const createRideRequest = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { totalPassengers, vehicleType, pickUpAddress, destinationAddress } = req.body;
    const ride = yield ride_service_1.RideServices.createRideRequest(decodedToken, totalPassengers, vehicleType, pickUpAddress, destinationAddress);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: "Ride created successfully",
        data: ride,
    });
}));
const getPendingRideRequests = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_service_1.RideServices.getPendingRideRequests();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: "Pending Requests Retrieved successfully",
        data: ride,
    });
}));
const getAllRidesData = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const rides = yield ride_service_1.RideServices.getAllRidesData(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: "All Rides Retrieved successfully",
        data: rides,
    });
}));
const getSingleRideData = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const ride = yield ride_service_1.RideServices.getSingleRideData(rideId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: "Ride Data Retrieved successfully",
        data: ride,
    });
}));
const getMyRidesData = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const rides = yield ride_service_1.RideServices.getMyRidesData(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: "All Rides Retrieved successfully",
        data: rides,
    });
}));
const cancleRideRequest = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const decodedToken = req.user;
    const ride = yield ride_service_1.RideServices.cancelRideRequest(res, rideId, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: `${ride === null || ride === void 0 ? void 0 : ride.message}`,
        data: ride === null || ride === void 0 ? void 0 : ride.ride,
    });
}));
const acceptRideRequest = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const decodedToken = req.user;
    const ride = yield ride_service_1.RideServices.acceptRideRequest(rideId, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: `${ride === null || ride === void 0 ? void 0 : ride.message}`,
        data: ride === null || ride === void 0 ? void 0 : ride.ride,
    });
}));
const updateRideRequest = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const decodedToken = req.user;
    const rideStatus = req.body.status;
    const otp = req.body.otp;
    const ride = yield ride_service_1.RideServices.updateRideRequest(rideId, decodedToken, rideStatus, otp);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: `${ride === null || ride === void 0 ? void 0 : ride.message}`,
        data: ride === null || ride === void 0 ? void 0 : ride.ride,
    });
}));
const viewEarnings = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const rides = yield ride_service_1.RideServices.viewEarnings(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatusCodes_1.HttpStatusCodes.CREATED,
        message: "Rides Summary Retrieved successfully",
        data: rides,
    });
}));
exports.RideControllers = {
    createRideRequest,
    getPendingRideRequests,
    getAllRidesData,
    getSingleRideData,
    getMyRidesData,
    cancleRideRequest,
    acceptRideRequest,
    updateRideRequest,
    viewEarnings,
};
