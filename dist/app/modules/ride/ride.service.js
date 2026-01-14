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
exports.RideServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const httpStatusCodes_1 = require("../../utils/httpStatusCodes");
const ride_model_1 = require("./ride.model");
const geoApiFy_1 = require("../../utils/geoApiFy");
const user_interface_1 = require("../user/user.interface");
const fareCalculationFormula_1 = require("../../utils/fareCalculationFormula");
const ride_constants_1 = require("./ride.constants");
const validatePassengerCount_1 = require("../../utils/validatePassengerCount");
const ride_interface_1 = require("./ride.interface");
const user_model_1 = require("../user/user.model");
const jwt_1 = require("../../utils/jwt");
const setCookie_1 = require("../../utils/setCookie");
const otp_service_1 = require("../otp/otp.service");
const moment_1 = __importDefault(require("moment"));
const queryBuilder_1 = require("../../utils/queryBuilder");
const createRideRequest = (decodedToken, totalPassengers, vehicleType, pickUpAddress, destinationAddress) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const riderId = decodedToken.userId;
    const rider = (yield user_model_1.User.findById(riderId));
    if (rider.penalties) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "To book another ride,please pay the pending fee on your account.We apoligize for any inconvenience.");
    }
    const activeRide = yield ride_model_1.Ride.findOne({
        riderId,
        status: { $in: ["PENDING", "ACCEPTED", "ONGOING"] },
    });
    if (activeRide) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "You already have an active ride. Please finish or cancel it before booking another.");
    }
    if (!vehicleType ||
        !Object.values(user_interface_1.VehicleType).includes(vehicleType)) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, `${vehicleType} is not available or not a valid vehicle type!`);
    }
    (0, validatePassengerCount_1.validatePassengerCount)(vehicleType, totalPassengers);
    if (!pickUpAddress) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Please select pickup location!");
    }
    const countryP = (_a = pickUpAddress.split(",").pop()) === null || _a === void 0 ? void 0 : _a.trim();
    if (countryP !== "Bangladesh") {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Please select a location inside Bangladesh");
    }
    if (!destinationAddress) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Please select destination location!");
    }
    const countryD = (_b = destinationAddress.split(",").pop()) === null || _b === void 0 ? void 0 : _b.trim();
    if (countryD !== "Bangladesh") {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Please select a location inside Bangladesh");
    }
    const pickUpCo = yield (0, geoApiFy_1.geocodeAddress)(pickUpAddress);
    if (!pickUpCo) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Sorry! Couldn't find your pickup location!Please check if location actually exists!");
    }
    const destinationCo = yield (0, geoApiFy_1.geocodeAddress)(destinationAddress);
    if (!destinationCo) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Sorry! Couldn't find your destination location!Please check if location actually exists!");
    }
    const totalDistance = (0, fareCalculationFormula_1.calculateDistance)(pickUpCo.latitude, pickUpCo.longitude, destinationCo.latitude, destinationCo.longitude);
    const estimatedTime = parseFloat(((totalDistance / 20) * 60).toFixed(2));
    const minEstFare = yield (0, fareCalculationFormula_1.calculateFare)(totalDistance, vehicleType, estimatedTime);
    const maxEstFare = minEstFare + 100;
    const ride = yield ride_model_1.Ride.create({
        riderId,
        totalPassengers,
        vehicleType,
        pickupLocation: {
            coordinates: { lng: pickUpCo.longitude, lat: pickUpCo.latitude },
            address: pickUpCo.address,
        },
        destinationLocation: {
            coordinates: {
                lng: destinationCo.longitude,
                lat: destinationCo.latitude,
            },
            address: destinationCo.address,
        },
        destinationDistanceInKm: totalDistance,
        destinationEta: estimatedTime,
        fareEstimate: { min: minEstFare, max: maxEstFare },
    });
    const rideId = ride._id;
    (_c = rider.bookings) === null || _c === void 0 ? void 0 : _c.push(rideId);
    yield rider.save();
    return ride;
});
const getPendingRideRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    const rideRequests = yield ride_model_1.Ride.find({ status: ride_interface_1.RIDE_STATUS.PENDING });
    return { rideRequests };
});
const getAllRidesData = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(ride_model_1.Ride.find(), query);
    const usersData = queryBuilder
        .filter()
        .search(ride_constants_1.rideSearchAbleFields)
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
const getSingleRideData = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Invalid Ride Id");
    }
    return { ride };
});
const getMyRidesData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const allRides = yield ride_model_1.Ride.find({
        $or: [{ riderId: userId }, { driverId: userId }],
    });
    if (allRides.length === 0) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Couldn't find any Ride Data");
    }
    return { allRides };
});
const getDriverStatus = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isDriverBusy = yield ride_model_1.Ride.findOne({
        $or: [{ riderId: userId }, { driverId: userId }],
        status: {
            $in: [
                ride_interface_1.RIDE_STATUS.PENDING,
                ride_interface_1.RIDE_STATUS.ACCEPTED,
                ride_interface_1.RIDE_STATUS.VEHICLE_ARRIVED,
                ride_interface_1.RIDE_STATUS.ONGOING,
            ],
        },
    });
    if (!isDriverBusy) {
        return {};
    }
    const riderId = isDriverBusy.riderId;
    const rider = (yield user_model_1.User.findById(riderId));
    return { isDriverBusy, rider };
});
const getActiveRide = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const activeRide = yield ride_model_1.Ride.findOne({
        $or: [{ riderId: userId }, { driverId: userId }],
        status: {
            $nin: [
                "COMPLETED",
                "CANCELLED_BY_RIDER",
                "CANCELLED_BY_DRIVER",
                "EXPIRED",
            ],
        },
    });
    if (!activeRide) {
        return {};
    }
    const driverId = activeRide === null || activeRide === void 0 ? void 0 : activeRide.driverId;
    let driver = {};
    if (driverId) {
        driver = (yield user_model_1.User.findById(driverId));
    }
    return { activeRide, driver };
});
const acceptRideRequest = (rideId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const ride = (yield ride_model_1.Ride.findById(rideId));
    if (!ride) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "No ride request found!");
    }
    const driverId = decodedToken.userId;
    const riderId = ride.riderId.toString();
    if (riderId === driverId) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Sorry! You can't accept your own ride!");
    }
    const rideSt = ride.status;
    if (rideSt !== ride_interface_1.RIDE_STATUS.PENDING) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, `This ride can't be accepted now since the ride is already ${rideSt}`);
    }
    const driver = (yield user_model_1.User.findById(driverId));
    if (!driver.isOnline) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "To accept a ride please set your isOnline status to true!");
    }
    const driverStatus = yield getDriverStatus(driverId);
    if (driverStatus.isDriverBusy) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "You can't accept another ride  untill you have completed your current ride!");
    }
    const driverLocation = (_a = driver.vehicleInfo) === null || _a === void 0 ? void 0 : _a.vehicleLocation;
    if (!driverLocation) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Please set your location!");
    }
    const pickUpLocationDistance = (0, fareCalculationFormula_1.calculateDistance)(ride.pickupLocation.coordinates.lat, ride.pickupLocation.coordinates.lng, driverLocation.coordinates.lat, driverLocation.coordinates.lng);
    // if (pickUpLocationDistance >= 5) {
    //   throw new AppError(
    //     HttpStatusCodes.BAD_REQUEST,
    //     "A driver within 5km distance can accept a ride only"
    //   );
    // }
    const rider = (yield user_model_1.User.findById(riderId));
    const email = rider.email;
    const sub = "Ride Request Verification Code";
    const temp = "rideConfirmationOtp";
    const riderName = rider.name;
    const driverName = driver.name;
    const vehicleModel = user_interface_1.VehicleType.CAR;
    const vehicleNumber = (_b = driver.vehicleInfo) === null || _b === void 0 ? void 0 : _b.vehicleNumberPlate;
    const pickUpAddress = ride.pickupLocation.address;
    const destinationAddress = ride.destinationLocation.address;
    const driverEta = (pickUpLocationDistance / 20) * 60;
    const destinationEta = ride.destinationEta;
    const fareEstimateMin = ride.fareEstimate.min;
    const fareEstimateMax = ride.fareEstimate.max;
    const tempData = {
        riderName,
        driverName,
        vehicleModel,
        vehicleNumber,
        pickUpAddress,
        destinationAddress,
        driverEta,
        destinationEta,
        fareEstimateMin,
        fareEstimateMax,
        rideId,
    };
    const OTP_EXPIRATION = 2 * 60 * 60;
    const rideStatus = ride.status;
    if (rideStatus === ride_interface_1.RIDE_STATUS.PENDING) {
        ride.driverId = driverId;
        ride.status = ride_interface_1.RIDE_STATUS.ACCEPTED;
        ride.driverEta = driverEta;
        ride.pickUpDistanceInKm = pickUpLocationDistance;
        ride.rideHistory.acceptedAt = new Date();
        yield ride.save();
        yield otp_service_1.OTPServices.sendOTP(email, sub, temp, tempData, OTP_EXPIRATION);
        const rideId = ride._id;
        (_c = driver.bookings) === null || _c === void 0 ? void 0 : _c.push(rideId);
        yield driver.save();
        return {
            message: `You've accepted the ride. Navigate to the pickup point: ${pickUpAddress}.`,
            ride,
        };
    }
});
const cancelRideRequest = (res, rideId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "No ride request found!");
    }
    const rideStatus = ride.status;
    const rideHistory = ride.rideHistory;
    const riderId = ride.riderId.toString();
    const driverId = (_a = ride.driverId) === null || _a === void 0 ? void 0 : _a.toString();
    const userId = decodedToken.userId;
    const rider = (yield user_model_1.User.findById(riderId));
    const driver = (yield user_model_1.User.findById(driverId));
    const now = new Date();
    const oneDay = new Date(now).setDate(now.getDate() - 1);
    if (userId !== riderId && userId !== driverId) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, "You're not permitted to cancel this ride");
    }
    if (rider && userId === riderId) {
        if (rideStatus === ride_interface_1.RIDE_STATUS.VEHICLE_ARRIVED) {
            ride.status = ride_interface_1.RIDE_STATUS.CANCELLED_BY_RIDER;
            rideHistory.cancelledAt = new Date();
            yield ride.save();
            rider.penalties = Number(rider.penalties) + 100;
            yield rider.save();
            return {
                message: "We understand plans change, but your driver was already at your pickup location.A 100Tk cancellation fee has been charged to your account to compensate the driver for their time and effort.To book another ride,please pay the pending fee on your account.We apoligize for any inconvenience.",
                ride,
            };
        }
        const acceptedRideCancelledByRiderInLast24Hours = yield ride_model_1.Ride.find({
            riderId,
            driverId: { $ne: null },
            status: ride_interface_1.RIDE_STATUS.CANCELLED_BY_RIDER,
            createdAt: { $gte: oneDay },
        }).countDocuments();
        if (acceptedRideCancelledByRiderInLast24Hours >= 1) {
            ride.status = ride_interface_1.RIDE_STATUS.CANCELLED_BY_RIDER;
            rideHistory.cancelledAt = new Date();
            yield ride.save();
            rider.penalties = Number(rider.penalties) + 50;
            yield rider.save();
            return {
                message: "We noticed you recently cancelled a ride after a driver was on their way. A cancellation fee of 50Tk has been added to your account,as this was your second cancellation within the last 24 hours after a driver accepted your trip. To book another ride,please pay the pending fee on your account.We apoligize for any inconvenience.",
                ride,
            };
        }
        if (rideStatus === ride_interface_1.RIDE_STATUS.ONGOING ||
            rideStatus === ride_interface_1.RIDE_STATUS.CANCELLED_BY_RIDER ||
            rideStatus === ride_interface_1.RIDE_STATUS.CANCELLED_BY_DRIVER ||
            rideStatus === ride_interface_1.RIDE_STATUS.COMPLETED ||
            rideStatus === ride_interface_1.RIDE_STATUS.EXPIRED) {
            throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, `This ride is already ${ride.status}. You can't cancel it now!`);
        }
        ride.status = ride_interface_1.RIDE_STATUS.CANCELLED_BY_RIDER;
        rideHistory.cancelledAt = new Date();
        yield ride.save();
        return {
            message: `This ride is succefully ${ride_interface_1.RIDE_STATUS.CANCELLED_BY_RIDER}`,
            ride,
        };
    }
    if (driver && userId === driverId) {
        if (rideStatus === ride_interface_1.RIDE_STATUS.VEHICLE_ARRIVED) {
            ride.status = ride_interface_1.RIDE_STATUS.CANCELLED_BY_DRIVER;
            rideHistory.cancelledAt = new Date();
            yield ride.save();
            driver.isActive = user_interface_1.IsActive.BLOCKED;
            yield driver.save();
            const jwtPayload = {
                userId: driver._id,
            };
            const blockedToken = (0, jwt_1.generateToken)(jwtPayload, driver.email, "12h");
            (0, setCookie_1.setAuthCookie)(res, { blockedToken: blockedToken });
            return {
                message: "We understand plans change, but you were already at your pickup location.We are blocking your account for next 12 hours.So,you won't be able accept or view any ride request till then.We apoligize for any inconvenience.",
                ride,
            };
        }
        const acceptedRideCancelledByDriverInLast24Hours = yield ride_model_1.Ride.find({
            driverId: driverId,
            status: ride_interface_1.RIDE_STATUS.CANCELLED_BY_DRIVER,
            createdAt: { $gte: oneDay },
        }).countDocuments();
        if (acceptedRideCancelledByDriverInLast24Hours >= 3) {
            ride.status = ride_interface_1.RIDE_STATUS.CANCELLED_BY_DRIVER;
            rideHistory.cancelledAt = new Date();
            yield ride.save();
            driver.isActive = user_interface_1.IsActive.INACTIVE;
            yield driver.save();
            const jwtPayload = {
                userId: driver._id,
            };
            const inActiveToken = (0, jwt_1.generateToken)(jwtPayload, driver.email, "12h");
            (0, setCookie_1.setAuthCookie)(res, { inActiveToken: inActiveToken });
            return {
                message: "We noticed you recently cancelled a ride after you accepted.We will set your account status INACTIVE for two days,as this was your fourth cancellation within the last 24 hours after you accepted a trip.From now on you will see less ride request than usual.We apoligize for any inconvenience.",
                ride,
            };
        }
        if (rideStatus === ride_interface_1.RIDE_STATUS.ONGOING ||
            rideStatus === ride_interface_1.RIDE_STATUS.CANCELLED_BY_RIDER ||
            rideStatus === ride_interface_1.RIDE_STATUS.CANCELLED_BY_DRIVER ||
            rideStatus === ride_interface_1.RIDE_STATUS.COMPLETED ||
            rideStatus === ride_interface_1.RIDE_STATUS.EXPIRED) {
            throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, `This ride is already ${ride.status}. You can't cancel it now!`);
        }
        ride.status = ride_interface_1.RIDE_STATUS.CANCELLED_BY_DRIVER;
        rideHistory.cancelledAt = new Date();
        yield ride.save();
        return {
            message: `This ride is succefully ${ride_interface_1.RIDE_STATUS.CANCELLED_BY_DRIVER}`,
            ride,
        };
    }
});
const updateRideRequest = (rideId, decodedToken, rideStatus, otp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = (yield ride_model_1.Ride.findById(rideId));
    if (!ride) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "No ride request found!");
    }
    const riderId = ride.riderId;
    const driverId = decodedToken.userId;
    const rider = (yield user_model_1.User.findById(riderId));
    if (driverId !== ((_a = ride.driverId) === null || _a === void 0 ? void 0 : _a.toString())) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED, "The driver who accepted the ride only he can update this ride status");
    }
    if (!Object.values(ride_interface_1.RIDE_STATUS).includes(rideStatus)) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, `${rideStatus} is not a valid Ride Status`);
    }
    if (rideStatus === ride_interface_1.RIDE_STATUS.ACCEPTED ||
        rideStatus === ride_interface_1.RIDE_STATUS.PENDING ||
        rideStatus === ride_interface_1.RIDE_STATUS.CANCELLED_BY_DRIVER ||
        rideStatus === ride_interface_1.RIDE_STATUS.CANCELLED_BY_RIDER ||
        rideStatus === ride_interface_1.RIDE_STATUS.EXPIRED) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, `You can't set ${rideStatus} status for a ride`);
    }
    const rideHistory = ride.rideHistory;
    if (ride.status === ride_interface_1.RIDE_STATUS.ACCEPTED &&
        rideStatus === ride_interface_1.RIDE_STATUS.VEHICLE_ARRIVED) {
        ride.status = ride_interface_1.RIDE_STATUS.VEHICLE_ARRIVED;
        rideHistory.vehicleArrivedAt = new Date();
        yield ride.save();
        return {
            message: `Ride status updated to ${ride.status} successfully!`,
            ride,
        };
    }
    if (ride.status === ride_interface_1.RIDE_STATUS.VEHICLE_ARRIVED &&
        rideStatus === ride_interface_1.RIDE_STATUS.ONGOING) {
        if (!otp) {
            throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "Before starting the ride,please verify using otp!");
        }
        yield otp_service_1.OTPServices.verifyOTP(rider.email, otp);
        ride.status = ride_interface_1.RIDE_STATUS.ONGOING;
        rideHistory.startedAt = new Date();
        yield ride.save();
        return {
            message: `OTP has been verified and ride status updated to ${ride.status} successfully!`,
            ride,
        };
    }
    if (ride.status === ride_interface_1.RIDE_STATUS.ONGOING &&
        rideStatus === ride_interface_1.RIDE_STATUS.COMPLETED) {
        ride.status = ride_interface_1.RIDE_STATUS.COMPLETED;
        rideHistory.completedAt = new Date();
        const diffMins = (0, moment_1.default)(rideHistory.completedAt).diff((0, moment_1.default)(rideHistory.startedAt), "minutes");
        rideHistory.travellingTimeInMins = diffMins;
        const totalFare = yield (0, fareCalculationFormula_1.calculateFare)(ride.destinationDistanceInKm, ride.vehicleType, rideHistory.travellingTimeInMins);
        rideHistory.totalFare = totalFare;
        yield ride.save();
        return {
            message: `Ride status updated to ${ride.status} successfully!`,
            ride,
        };
    }
    if (ride.status === ride_interface_1.RIDE_STATUS.COMPLETED && rideStatus) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, "You can't set any ride status now since the ride is COMPLETED");
    }
    throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, `You can't set ${rideStatus} now since the ride status is ${ride.status}. Right sequence is ACCEPTED -> VEHICLE_ARRIVED -> ONGOING -> COMPLETED`);
});
const viewEarnings = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = decodedToken.userId;
    const driver = (yield user_model_1.User.findById(driverId).populate("bookings", "_id status totalPassengers distanceInKm rideHistory.totalFare"));
    if (!driver) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "Driver not found");
    }
    const allRides = driver.bookings;
    if (!allRides || allRides.length === 0) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.NOT_FOUND, "No rides found");
    }
    const completedRides = allRides.filter((ride) => ride.status === ride_interface_1.RIDE_STATUS.COMPLETED);
    const totalEarnings = completedRides.reduce((sum, ride) => {
        const fare = ride.rideHistory.totalFare || 0;
        return sum + fare;
    }, 0);
    const totalRides = completedRides.length;
    const averageFare = totalRides > 0 ? totalEarnings / totalRides : 0;
    const sortedRides = completedRides.sort((a, b) => {
        var _a, _b;
        return new Date(((_a = b.rideHistory) === null || _a === void 0 ? void 0 : _a.completedAt) || "").getTime() -
            new Date(((_b = a.rideHistory) === null || _b === void 0 ? void 0 : _b.completedAt) || "").getTime();
    });
    return {
        summary: {
            totalRides,
            totalEarnings,
            averageFare: averageFare.toFixed(2),
        },
        rides: sortedRides,
    };
});
exports.RideServices = {
    createRideRequest,
    getPendingRideRequests,
    getAllRidesData,
    getDriverStatus,
    getSingleRideData,
    getMyRidesData,
    getActiveRide,
    cancelRideRequest,
    acceptRideRequest,
    updateRideRequest,
    viewEarnings,
};
