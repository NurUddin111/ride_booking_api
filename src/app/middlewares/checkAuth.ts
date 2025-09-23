import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../errorHelpers/AppError";
import { HttpStatusCodes } from "../utils/httpStatusCodes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { checkUserStatus } from "../utils/checkUserStatus";
import { IUser } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new AppError(HttpStatusCodes.UNAUTHORIZED, "No Token Recieved");
    }

    const verifiedToken = verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const email = verifiedToken.email;

    const user = (await User.findOne({ email })) as IUser;

    checkUserStatus(user);

    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(
        HttpStatusCodes.UNAUTHORIZED,
        "You are not permitted to view this route!!!"
      );
    }

    req.user = verifiedToken;
    next();
  });
