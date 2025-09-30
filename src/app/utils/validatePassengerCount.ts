import AppError from "../errorHelpers/AppError";
import { VehicleType } from "../modules/user/user.interface";
import { HttpStatusCodes } from "./httpStatusCodes";

const MAX_PASSENGERS: Record<VehicleType, number> = {
  [VehicleType.BIKE]: 1,
  [VehicleType.CNG]: 3,
  [VehicleType.CAR]: 4,
  [VehicleType.MICROBUS]: 10,
};

export const validatePassengerCount = (
  vehicleType: VehicleType,
  totalPassengers: number
) => {
  const max = MAX_PASSENGERS[vehicleType];
  if (totalPassengers > max) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      `${vehicleType} can carry up to ${max} passengers.`
    );
  }
};
