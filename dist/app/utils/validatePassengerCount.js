"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassengerCount = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_interface_1 = require("../modules/user/user.interface");
const httpStatusCodes_1 = require("./httpStatusCodes");
const MAX_PASSENGERS = {
    [user_interface_1.VehicleType.BIKE]: 1,
    [user_interface_1.VehicleType.CNG]: 3,
    [user_interface_1.VehicleType.CAR]: 4,
    [user_interface_1.VehicleType.MICROBUS]: 10,
};
const validatePassengerCount = (vehicleType, totalPassengers) => {
    const max = MAX_PASSENGERS[vehicleType];
    if (totalPassengers > max) {
        throw new AppError_1.default(httpStatusCodes_1.HttpStatusCodes.BAD_REQUEST, `${vehicleType} can carry up to ${max} passengers.`);
    }
};
exports.validatePassengerCount = validatePassengerCount;
