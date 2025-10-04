export const RATES = {
  BIKE: {
    baseFare: 50,
    perKmRate: 15,
    perMinuteRate: 1,
    minimumFare: 60,
  },
  CNG: {
    baseFare: 70,
    perKmRate: 25,
    perMinuteRate: 3,
    minimumFare: 120,
  },
  CAR: {
    baseFare: 100,
    perKmRate: 30,
    perMinuteRate: 5,
    minimumFare: 150,
  },
  MICROBUS: {
    baseFare: 150,
    perKmRate: 40,
    perMinuteRate: 7,
    minimumFare: 200,
  },
};

export const rideSearchAbleFields = ["riderId","driverId","vehicleType","status"]
