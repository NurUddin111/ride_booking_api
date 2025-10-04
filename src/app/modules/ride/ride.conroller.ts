/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatusCodes } from "../../utils/httpStatusCodes";
import { RideServices } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";
import { RIDE_STATUS } from "./ride.interface";

const createRideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { totalPassengers, vehicleType, pickUpAddress, destinationAddress } =
      req.body;

    const ride = await RideServices.createRideRequest(
      decodedToken,
      totalPassengers,
      vehicleType,
      pickUpAddress,
      destinationAddress
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: "Ride created successfully",
      data: ride,
    });
  }
);

const getPendingRideRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ride = await RideServices.getPendingRideRequests();

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: "Pending Requests Retrieved successfully",
      data: ride,
    });
  }
);

const getAllRidesData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const rides = await RideServices.getAllRidesData(query);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: "All Rides Retrieved successfully",
      data: rides,
    });
  }
);

const getSingleRideData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;

    const ride = await RideServices.getSingleRideData(rideId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: "Ride Data Retrieved successfully",
      data: ride,
    });
  }
);

const getMyRidesData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    const rides = await RideServices.getMyRidesData(userId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: "All Rides Retrieved successfully",
      data: rides,
    });
  }
);

const cancleRideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const decodedToken = req.user as JwtPayload;

    const ride = await RideServices.cancelRideRequest(
      res,
      rideId,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: `${ride?.message}`,
      data: ride?.ride,
    });
  }
);

const acceptRideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const decodedToken = req.user as JwtPayload;

    const ride = await RideServices.acceptRideRequest(rideId, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: `${ride?.message}`,
      data: ride?.ride,
    });
  }
);

const updateRideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const decodedToken = req.user as JwtPayload;
    const rideStatus = req.body.status as RIDE_STATUS;
    const otp = req.body.otp;

    const ride = await RideServices.updateRideRequest(
      rideId,
      decodedToken,
      rideStatus,
      otp
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: `${ride?.message}`,
      data: ride?.ride,
    });
  }
);

const viewEarnings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const rides = await RideServices.viewEarnings(decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: "Rides Summary Retrieved successfully",
      data: rides,
    });
  }
);

export const RideControllers = {
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
