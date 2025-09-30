import { redisClient } from "../../config/redis.config";

const setVehicleLocation = async (
  driverId: string,
  lng: number,
  lat: number
) => {
  await redisClient.sendCommand([
    "GEOADD",
    "drivers:locations",
    lng.toString(),
    lat.toString(),
    driverId,
  ]);
};

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

export const RedisServices = { setVehicleLocation };
