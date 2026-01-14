import AppError from "../errorHelpers/AppError";

import { HttpStatusCodes } from "./httpStatusCodes";
import { IsActive, IUser } from "../modules/user/user.interface";
import { verifyToken } from "./jwt";
import { JwtPayload } from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import { Request } from "express";

export const checkUserStatus = async (
  req: Request,
  user: HydratedDocument<IUser>,
  email: string,
) => {
  if (!user) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "User does not exist");
  }
  if (user.isDeleted) {
    throw new AppError(HttpStatusCodes.FORBIDDEN, "User is deleted");
  }
  if (!user.isVerified) {
    throw new AppError(HttpStatusCodes.FORBIDDEN, "User is not verified");
  }
  const blockedToken = req.cookies.blockedToken;
  const inActiveToken = req.cookies.inActiveToken;

  if (blockedToken) {
    const verifiedBlockedToken = verifyToken(blockedToken, email) as JwtPayload;
    if (!verifiedBlockedToken) {
      user.isActive = IsActive.ACTIVE;
      await user.save();
    }
  }

  if (!blockedToken && user.isActive === IsActive.BLOCKED) {
    user.isActive = IsActive.ACTIVE;
    await user.save();
  }

  if (inActiveToken) {
    const verifiedInActiveToken = verifyToken(
      inActiveToken,
      email
    ) as JwtPayload;
    if (verifiedInActiveToken) {
      user.isActive = IsActive.ACTIVE;
      await user.save();
    }
  }
  if (user.isActive === IsActive.BLOCKED) {
    throw new AppError(HttpStatusCodes.FORBIDDEN, `User is ${user.isActive}`);
  }
};
