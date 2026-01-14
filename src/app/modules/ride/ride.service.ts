import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { HttpStatusCodes } from "../../utils/httpStatusCodes";
import { Ride } from "./ride.model";
import { geocodeAddress } from "../../utils/geoApiFy";
import { IsActive, IUser, VehicleType } from "../user/user.interface";
import {
  calculateDistance,
  calculateFare,
} from "../../utils/fareCalculationFormula";
import { RATES, rideSearchAbleFields } from "./ride.constants";
import { validatePassengerCount } from "../../utils/validatePassengerCount";
import { IRide, RIDE_STATUS } from "./ride.interface";
import { User } from "../user/user.model";
import { HydratedDocument } from "mongoose";
import { generateToken } from "../../utils/jwt";
import { setAuthCookie } from "../../utils/setCookie";
import { Response } from "express";
import { OTPServices } from "../otp/otp.service";
import moment from "moment";
import { QueryBuilder } from "../../utils/queryBuilder";

const createRideRequest = async (
  decodedToken: JwtPayload,
  totalPassengers: number,
  vehicleType: string,
  pickUpAddress: string,
  destinationAddress: string
) => {
  const riderId = decodedToken.userId;
  const rider = (await User.findById(riderId)) as HydratedDocument<IUser>;

  if (rider.penalties) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "To book another ride,please pay the pending fee on your account.We apoligize for any inconvenience."
    );
  }

  const activeRide = await Ride.findOne({
    riderId,
    status: { $in: ["PENDING", "ACCEPTED", "ONGOING"] },
  });

  if (activeRide) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "You already have an active ride. Please finish or cancel it before booking another."
    );
  }

  if (
    !vehicleType ||
    !Object.values(VehicleType).includes(vehicleType as VehicleType)
  ) {
    throw new AppError(
      HttpStatusCodes.NOT_FOUND,
      `${vehicleType} is not available or not a valid vehicle type!`
    );
  }

  validatePassengerCount(vehicleType as VehicleType, totalPassengers);

  if (!pickUpAddress) {
    throw new AppError(
      HttpStatusCodes.NOT_FOUND,
      "Please select pickup location!"
    );
  }

  const countryP = pickUpAddress.split(",").pop()?.trim();
  if (countryP !== "Bangladesh") {
    throw new AppError(
      HttpStatusCodes.NOT_FOUND,
      "Please select a location inside Bangladesh"
    );
  }

  if (!destinationAddress) {
    throw new AppError(
      HttpStatusCodes.NOT_FOUND,
      "Please select destination location!"
    );
  }

  const countryD = destinationAddress.split(",").pop()?.trim();
  if (countryD !== "Bangladesh") {
    throw new AppError(
      HttpStatusCodes.NOT_FOUND,
      "Please select a location inside Bangladesh"
    );
  }

  const pickUpCo = await geocodeAddress(pickUpAddress);

  if (!pickUpCo) {
    throw new AppError(
      HttpStatusCodes.NOT_FOUND,
      "Sorry! Couldn't find your pickup location!Please check if location actually exists!"
    );
  }

  const destinationCo = await geocodeAddress(destinationAddress);

  if (!destinationCo) {
    throw new AppError(
      HttpStatusCodes.NOT_FOUND,
      "Sorry! Couldn't find your destination location!Please check if location actually exists!"
    );
  }

  const totalDistance = calculateDistance(
    pickUpCo.latitude,
    pickUpCo.longitude,
    destinationCo.latitude,
    destinationCo.longitude
  );

  const estimatedTime = parseFloat(((totalDistance / 20) * 60).toFixed(2));

  const minEstFare = await calculateFare(
    totalDistance,
    vehicleType as keyof typeof RATES,
    estimatedTime
  );

  const maxEstFare = minEstFare + 100;

  const ride = await Ride.create({
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
  rider.bookings?.push(rideId);
  await rider.save();

  return ride;
};

const getPendingRideRequests = async () => {
  const rideRequests = await Ride.find({ status: RIDE_STATUS.PENDING });
  return { rideRequests };
};

const getAllRidesData = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Ride.find(), query);
  const usersData = queryBuilder
    .filter()
    .search(rideSearchAbleFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleRideData = async (rideId: string) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "Invalid Ride Id");
  }
  return { ride };
};

const getMyRidesData = async (userId: string) => {
  const allRides = await Ride.find({
    $or: [{ riderId: userId }, { driverId: userId }],
  });

  if (allRides.length === 0) {
    throw new AppError(
      HttpStatusCodes.NOT_FOUND,
      "Couldn't find any Ride Data"
    );
  }
  return { allRides };
};

const getDriverStatus = async (userId: string) => {
  const isDriverBusy = await Ride.findOne({
    $or: [{ riderId: userId }, { driverId: userId }],
    status: {
      $in: [
        RIDE_STATUS.PENDING,
        RIDE_STATUS.ACCEPTED,
        RIDE_STATUS.VEHICLE_ARRIVED,
        RIDE_STATUS.ONGOING,
      ],
    },
  });

  if (!isDriverBusy) {
    return {};
  }

  const riderId = isDriverBusy.riderId;
  const rider = (await User.findById(riderId)) as HydratedDocument<IUser>;

  return { isDriverBusy, rider };
};

const getActiveRide = async (userId: string) => {
  const activeRide = await Ride.findOne({
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

  const driverId = activeRide?.driverId;
  let driver = {};

  if (driverId) {
    driver = (await User.findById(driverId)) as HydratedDocument<IUser>;
  }

  return { activeRide, driver };
};

const acceptRideRequest = async (rideId: string, decodedToken: JwtPayload) => {
  const ride = (await Ride.findById(rideId)) as HydratedDocument<IRide>;

  if (!ride) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "No ride request found!");
  }

  const driverId = decodedToken.userId;
  const riderId = ride.riderId.toString();

  if (riderId === driverId) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "Sorry! You can't accept your own ride!"
    );
  }

  const rideSt = ride.status;

  if (rideSt !== RIDE_STATUS.PENDING) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      `This ride can't be accepted now since the ride is already ${rideSt}`
    );
  }

  const driver = (await User.findById(driverId)) as HydratedDocument<IUser>;

  if (!driver.isOnline) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "To accept a ride please set your isOnline status to true!"
    );
  }

  const driverStatus = await getDriverStatus(driverId);

  if (driverStatus.isDriverBusy) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "You can't accept another ride  untill you have completed your current ride!"
    );
  }

  const driverLocation = driver.vehicleInfo?.vehicleLocation;

  if (!driverLocation) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "Please set your location!"
    );
  }

  const pickUpLocationDistance = calculateDistance(
    ride.pickupLocation.coordinates.lat,
    ride.pickupLocation.coordinates.lng,
    driverLocation.coordinates.lat,
    driverLocation.coordinates.lng
  );

  // if (pickUpLocationDistance >= 5) {
  //   throw new AppError(
  //     HttpStatusCodes.BAD_REQUEST,
  //     "A driver within 5km distance can accept a ride only"
  //   );
  // }

  const rider = (await User.findById(riderId)) as HydratedDocument<IUser>;
  const email = rider.email;
  const sub = "Ride Request Verification Code";
  const temp = "rideConfirmationOtp";
  const riderName = rider.name;
  const driverName = driver.name;
  const vehicleModel = VehicleType.CAR;
  const vehicleNumber = driver.vehicleInfo?.vehicleNumberPlate;
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

  if (rideStatus === RIDE_STATUS.PENDING) {
    ride.driverId = driverId;
    ride.status = RIDE_STATUS.ACCEPTED;
    ride.driverEta = driverEta;
    ride.pickUpDistanceInKm = pickUpLocationDistance;
    ride.rideHistory.acceptedAt = new Date();
    await ride.save();
    await OTPServices.sendOTP(email, sub, temp, tempData, OTP_EXPIRATION);

    const rideId = ride._id;
    driver.bookings?.push(rideId);
    await driver.save();

    return {
      message: `You've accepted the ride. Navigate to the pickup point: ${pickUpAddress}.`,
      ride,
    };
  }
};

const cancelRideRequest = async (
  res: Response,
  rideId: string,
  decodedToken: JwtPayload
) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "No ride request found!");
  }

  const rideStatus = ride.status;
  const rideHistory = ride.rideHistory;

  const riderId = ride.riderId.toString();
  const driverId = ride.driverId?.toString();
  const userId = decodedToken.userId;

  const rider = (await User.findById(riderId)) as HydratedDocument<IUser>;
  const driver = (await User.findById(driverId)) as HydratedDocument<IUser>;

  const now = new Date();
  const oneDay = new Date(now).setDate(now.getDate() - 1);

  if (userId !== riderId && userId !== driverId) {
    throw new AppError(
      HttpStatusCodes.UNAUTHORIZED,
      "You're not permitted to cancel this ride"
    );
  }

  if (rider && userId === riderId) {
    if (rideStatus === RIDE_STATUS.VEHICLE_ARRIVED) {
      ride.status = RIDE_STATUS.CANCELLED_BY_RIDER;
      rideHistory.cancelledAt = new Date();
      await ride.save();
      rider.penalties = Number(rider.penalties) + 100;
      await rider.save();
      return {
        message:
          "We understand plans change, but your driver was already at your pickup location.A 100Tk cancellation fee has been charged to your account to compensate the driver for their time and effort.To book another ride,please pay the pending fee on your account.We apoligize for any inconvenience.",
        ride,
      };
    }

    const acceptedRideCancelledByRiderInLast24Hours = await Ride.find({
      riderId,
      driverId: { $ne: null },
      status: RIDE_STATUS.CANCELLED_BY_RIDER,
      createdAt: { $gte: oneDay },
    }).countDocuments();

    if (acceptedRideCancelledByRiderInLast24Hours >= 1) {
      ride.status = RIDE_STATUS.CANCELLED_BY_RIDER;
      rideHistory.cancelledAt = new Date();
      await ride.save();
      rider.penalties = Number(rider.penalties) + 50;
      await rider.save();
      return {
        message:
          "We noticed you recently cancelled a ride after a driver was on their way. A cancellation fee of 50Tk has been added to your account,as this was your second cancellation within the last 24 hours after a driver accepted your trip. To book another ride,please pay the pending fee on your account.We apoligize for any inconvenience.",
        ride,
      };
    }

    if (
      rideStatus === RIDE_STATUS.ONGOING ||
      rideStatus === RIDE_STATUS.CANCELLED_BY_RIDER ||
      rideStatus === RIDE_STATUS.CANCELLED_BY_DRIVER ||
      rideStatus === RIDE_STATUS.COMPLETED ||
      rideStatus === RIDE_STATUS.EXPIRED
    ) {
      throw new AppError(
        HttpStatusCodes.BAD_REQUEST,
        `This ride is already ${ride.status}. You can't cancel it now!`
      );
    }

    ride.status = RIDE_STATUS.CANCELLED_BY_RIDER;
    rideHistory.cancelledAt = new Date();
    await ride.save();
    return {
      message: `This ride is succefully ${RIDE_STATUS.CANCELLED_BY_RIDER}`,
      ride,
    };
  }

  if (driver && userId === driverId) {
    if (rideStatus === RIDE_STATUS.VEHICLE_ARRIVED) {
      ride.status = RIDE_STATUS.CANCELLED_BY_DRIVER;
      rideHistory.cancelledAt = new Date();
      await ride.save();
      driver.isActive = IsActive.BLOCKED;
      await driver.save();
      const jwtPayload = {
        userId: driver._id,
      };
      const blockedToken = generateToken(jwtPayload, driver.email, "12h");
      setAuthCookie(res, { blockedToken: blockedToken });
      return {
        message:
          "We understand plans change, but you were already at your pickup location.We are blocking your account for next 12 hours.So,you won't be able accept or view any ride request till then.We apoligize for any inconvenience.",
        ride,
      };
    }

    const acceptedRideCancelledByDriverInLast24Hours = await Ride.find({
      driverId: driverId,
      status: RIDE_STATUS.CANCELLED_BY_DRIVER,
      createdAt: { $gte: oneDay },
    }).countDocuments();

    if (acceptedRideCancelledByDriverInLast24Hours >= 3) {
      ride.status = RIDE_STATUS.CANCELLED_BY_DRIVER;
      rideHistory.cancelledAt = new Date();
      await ride.save();
      driver.isActive = IsActive.INACTIVE;
      await driver.save();
      const jwtPayload = {
        userId: driver._id,
      };
      const inActiveToken = generateToken(jwtPayload, driver.email, "12h");

      setAuthCookie(res, { inActiveToken: inActiveToken });
      return {
        message:
          "We noticed you recently cancelled a ride after you accepted.We will set your account status INACTIVE for two days,as this was your fourth cancellation within the last 24 hours after you accepted a trip.From now on you will see less ride request than usual.We apoligize for any inconvenience.",
        ride,
      };
    }

    if (
      rideStatus === RIDE_STATUS.ONGOING ||
      rideStatus === RIDE_STATUS.CANCELLED_BY_RIDER ||
      rideStatus === RIDE_STATUS.CANCELLED_BY_DRIVER ||
      rideStatus === RIDE_STATUS.COMPLETED ||
      rideStatus === RIDE_STATUS.EXPIRED
    ) {
      throw new AppError(
        HttpStatusCodes.BAD_REQUEST,
        `This ride is already ${ride.status}. You can't cancel it now!`
      );
    }

    ride.status = RIDE_STATUS.CANCELLED_BY_DRIVER;
    rideHistory.cancelledAt = new Date();
    await ride.save();

    return {
      message: `This ride is succefully ${RIDE_STATUS.CANCELLED_BY_DRIVER}`,
      ride,
    };
  }
};

const updateRideRequest = async (
  rideId: string,
  decodedToken: JwtPayload,
  rideStatus: RIDE_STATUS,
  otp: string
) => {
  const ride = (await Ride.findById(rideId)) as HydratedDocument<IRide>;

  if (!ride) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "No ride request found!");
  }
  const riderId = ride.riderId;
  const driverId = decodedToken.userId;

  const rider = (await User.findById(riderId)) as HydratedDocument<IUser>;

  if (driverId !== ride.driverId?.toString()) {
    throw new AppError(
      HttpStatusCodes.UNAUTHORIZED,
      "The driver who accepted the ride only he can update this ride status"
    );
  }

  if (!Object.values(RIDE_STATUS).includes(rideStatus)) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      `${rideStatus} is not a valid Ride Status`
    );
  }

  if (
    rideStatus === RIDE_STATUS.ACCEPTED ||
    rideStatus === RIDE_STATUS.PENDING ||
    rideStatus === RIDE_STATUS.CANCELLED_BY_DRIVER ||
    rideStatus === RIDE_STATUS.CANCELLED_BY_RIDER ||
    rideStatus === RIDE_STATUS.EXPIRED
  ) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      `You can't set ${rideStatus} status for a ride`
    );
  }

  const rideHistory = ride.rideHistory;

  if (
    ride.status === RIDE_STATUS.ACCEPTED &&
    rideStatus === RIDE_STATUS.VEHICLE_ARRIVED
  ) {
    ride.status = RIDE_STATUS.VEHICLE_ARRIVED;
    rideHistory.vehicleArrivedAt = new Date();
    await ride.save();
    return {
      message: `Ride status updated to ${ride.status} successfully!`,
      ride,
    };
  }

  if (
    ride.status === RIDE_STATUS.VEHICLE_ARRIVED &&
    rideStatus === RIDE_STATUS.ONGOING
  ) {
    if (!otp) {
      throw new AppError(
        HttpStatusCodes.BAD_REQUEST,
        "Before starting the ride,please verify using otp!"
      );
    }
    await OTPServices.verifyOTP(rider.email, otp);
    ride.status = RIDE_STATUS.ONGOING;
    rideHistory.startedAt = new Date();
    await ride.save();
    return {
      message: `OTP has been verified and ride status updated to ${ride.status} successfully!`,
      ride,
    };
  }

  if (
    ride.status === RIDE_STATUS.ONGOING &&
    rideStatus === RIDE_STATUS.COMPLETED
  ) {
    ride.status = RIDE_STATUS.COMPLETED;
    rideHistory.completedAt = new Date();
    const diffMins = moment(rideHistory.completedAt).diff(
      moment(rideHistory.startedAt),
      "minutes"
    );
    rideHistory.travellingTimeInMins = diffMins;
    const totalFare = await calculateFare(
      ride.destinationDistanceInKm,
      ride.vehicleType,
      rideHistory.travellingTimeInMins
    );
    rideHistory.totalFare = totalFare;
    await ride.save();
    return {
      message: `Ride status updated to ${ride.status} successfully!`,
      ride,
    };
  }

  if (ride.status === RIDE_STATUS.COMPLETED && rideStatus) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "You can't set any ride status now since the ride is COMPLETED"
    );
  }

  throw new AppError(
    HttpStatusCodes.BAD_REQUEST,
    `You can't set ${rideStatus} now since the ride status is ${ride.status}. Right sequence is ACCEPTED -> VEHICLE_ARRIVED -> ONGOING -> COMPLETED`
  );
};

const viewEarnings = async (decodedToken: JwtPayload) => {
  const driverId = decodedToken.userId;
  const driver = (await User.findById(driverId).populate(
    "bookings",
    "_id status totalPassengers distanceInKm rideHistory.totalFare"
  )) as HydratedDocument<IUser>;

  if (!driver) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "Driver not found");
  }

  const allRides = driver.bookings as unknown as IRide[];

  if (!allRides || allRides.length === 0) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "No rides found");
  }

  const completedRides = allRides.filter(
    (ride) => ride.status === RIDE_STATUS.COMPLETED
  );

  const totalEarnings = completedRides.reduce((sum, ride) => {
    const fare = ride.rideHistory.totalFare || 0;
    return sum + fare;
  }, 0);

  const totalRides = completedRides.length;
  const averageFare = totalRides > 0 ? totalEarnings / totalRides : 0;

  const sortedRides = completedRides.sort(
    (a, b) =>
      new Date(b.rideHistory?.completedAt || "").getTime() -
      new Date(a.rideHistory?.completedAt || "").getTime()
  );

  return {
    summary: {
      totalRides,
      totalEarnings,
      averageFare: averageFare.toFixed(2),
    },
    rides: sortedRides,
  };
};

export const RideServices = {
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
