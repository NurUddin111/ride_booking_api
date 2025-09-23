import AppError from "../errorHelpers/AppError";

import { HttpStatusCodes } from "./httpStatusCodes";
import { IsActive, IUser } from "../modules/user/user.interface";

export const checkUserStatus = (user: IUser) => {
  if (!user) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "User does not exist");
  }
  if (user.isDeleted) {
    throw new AppError(HttpStatusCodes.FORBIDDEN, "User is deleted");
  }
  if (
    user.isActive === IsActive.BLOCKED ||
    user.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(HttpStatusCodes.FORBIDDEN, `User is ${user.isActive}`);
  }
  if (!user.isVerified) {
    throw new AppError(HttpStatusCodes.FORBIDDEN, "User is not verified");
  }
};
