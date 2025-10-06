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
exports.calculateFare = exports.calculateDistance = void 0;
const ride_constants_1 = require("../modules/ride/ride.constants");
const toRad = (value) => (value * Math.PI) / 180;
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const totalDistance = parseFloat((R * c).toFixed(2));
    return totalDistance;
};
exports.calculateDistance = calculateDistance;
const calculateFare = (distanceInKm_1, vehicleType_1, estimatedTimeInMinutes_1, ...args_1) => __awaiter(void 0, [distanceInKm_1, vehicleType_1, estimatedTimeInMinutes_1, ...args_1], void 0, function* (distanceInKm, vehicleType, estimatedTimeInMinutes, surgeMultiplier = 1) {
    const rates = ride_constants_1.RATES[vehicleType];
    if (!rates) {
        throw new Error(`Invalid vehicle type: ${vehicleType}`);
    }
    let calculatedFare = rates.baseFare +
        distanceInKm * rates.perKmRate +
        estimatedTimeInMinutes * rates.perMinuteRate;
    calculatedFare *= surgeMultiplier;
    const finalFare = parseFloat(Math.max(calculatedFare, rates.minimumFare).toFixed(2));
    return finalFare;
});
exports.calculateFare = calculateFare;
