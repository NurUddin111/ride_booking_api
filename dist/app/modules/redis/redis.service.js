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
exports.RedisServices = void 0;
const redis_config_1 = require("../../config/redis.config");
const setVehicleLocation = (driverId, lng, lat) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_config_1.redisClient.sendCommand([
        "GEOADD",
        "drivers:locations",
        lng.toString(),
        lat.toString(),
        driverId,
    ]);
});
// const nearByDrivers = async (
//   lng: number,
//   lat: number,
//   radiusMeters: number
// ) => {
//   const result: any = await redisClient.sendCommand([
//     "GEORADIUS",
//     "drivers:locations",
//     lng.toString(),
//     lat.toString(),
//     (radiusMeters / 1000).toString(),
//     "km",
//     "WITHDIST",
//   ]);
//   const selectedDrivers = result.map((driver: any[]) => ({
//     driverId: driver[0],
//     distance: parseFloat(driver[1]),
//   }));
//   return selectedDrivers;
// };
exports.RedisServices = { setVehicleLocation };
