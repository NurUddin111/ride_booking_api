import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../errorHelpers/AppError";
import { HttpStatusCodes } from "../utils/httpStatusCodes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { checkUserStatus } from "../utils/checkUserStatus";
import { IUser, Role } from "../modules/user/user.interface";
import { HydratedDocument } from "mongoose";

export const checkAuth = (...authRoles: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new AppError(HttpStatusCodes.UNAUTHORIZED, "No access token received.Please login get new access token...");
    }

    const verifiedAccessToken = verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const userRole = verifiedAccessToken.role;
    const userId = verifiedAccessToken.userId;

    if (!authRoles.includes(userRole)) {
      throw new AppError(
        HttpStatusCodes.UNAUTHORIZED,
        "You are not permitted to view this route!!!"
      );
    }

    if (userRole === Role.DRIVER) {
      const driverId = userId;
      const driver = (await User.findById(driverId)) as HydratedDocument<IUser>;

      if (!driver.vehicleInfo) {
        throw new AppError(
          HttpStatusCodes.BAD_REQUEST,
          "You aren't authorized since you haven't submitted your vehicle information!"
        );
      }

      if (driver.vehicleInfo && !driver.isDriverApproved) {
        throw new AppError(
          HttpStatusCodes.BAD_REQUEST,
          "Your vehicle details are pending approval. You'll be able to perform this action once approved. Please review and update if needed."
        );
      }
    }

    const email = verifiedAccessToken.email;
    const user = (await User.findOne({ email })) as HydratedDocument<IUser>;

    checkUserStatus(req, user, email);

    req.user = verifiedAccessToken;
    next();
  });
