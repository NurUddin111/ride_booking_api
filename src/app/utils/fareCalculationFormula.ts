import { RATES } from "../modules/ride/ride.constants";

export interface FareRates {
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  minimumFare: number;
}

const toRad = (value: number) => (value * Math.PI) / 180;

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const totalDistance = parseFloat((R * c).toFixed(2));
  return totalDistance;
};

export const calculateFare = async (
  distanceInKm: number,
  vehicleType: keyof typeof RATES,
  estimatedTimeInMinutes: number,
  surgeMultiplier = 1
) => {
  const rates: FareRates = RATES[vehicleType];
  if (!rates) {
    throw new Error(`Invalid vehicle type: ${vehicleType}`);
  }

  let calculatedFare =
    rates.baseFare +
    distanceInKm * rates.perKmRate +
    estimatedTimeInMinutes * rates.perMinuteRate;

  calculatedFare *= surgeMultiplier;

  const finalFare = parseFloat(
    Math.max(calculatedFare, rates.minimumFare).toFixed(2)
  );

  return finalFare;
};
