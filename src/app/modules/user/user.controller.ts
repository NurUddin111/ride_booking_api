/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { IUser } from "./user.interface";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatusCodes } from "../../utils/httpStatusCodes";
import { JwtPayload } from "jsonwebtoken";
import { RedisServices } from "../redis/redis.service";

const createUserRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    await UserServices.createUserRequest(res, name, email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP sent successfully",
      data: null,
    });
  }
);

const createUserVerification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const creationToken = req.cookies.creationToken;
    const { otp } = req.body;
    await UserServices.createUserVerification(res, creationToken, otp);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP verified successfully",
      data: null,
    });
  }
);

const createUserSuccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedCreationToken = req.cookies.verifiedCreationToken;
    const { password, role } = req.body;
    const payload = {
      password: password,
      role: role,
    };

    const user = await UserServices.createUserSuccess(
      res,
      verifiedCreationToken,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: "User created successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const users = await UserServices.getAllUsers(query);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "All users retrieved successfully",
      data: users,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await UserServices.getSingleUser(id);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "User retrieved successfully",
      data: user,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.CREATED,
      message: "Your profile Retrieved Successfully",
      data: result.data,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload: Partial<IUser> = req.body;
    const verifiedToken = req.user as JwtPayload;
    const user = await UserServices.updateUser(id, payload, verifiedToken);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "User updated successfully",
      data: user,
    });
  }
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await UserServices.deleteUser(id);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "User deleted successfully",
      data: user,
    });
  }
);

const updateVehicleLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const address = req.body.address;
    const vehicleLocation = await UserServices.setVehicleLocation(
      decodedToken,
      address
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "Driver Location Updated successfully",
      data: vehicleLocation,
    });
  }
);

export const UserControllers = {
  createUserRequest,
  createUserVerification,
  createUserSuccess,
  getAllUsers,
  getSingleUser,
  getMe,
  updateUser,
  deleteUser,
  updateVehicleLocation,
};
