import  { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { User } from "../user/user.model";
import { IAuthProvider, IUser } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import { HttpStatusCodes } from "../../utils/httpStatusCodes";
import { envVars } from "../../config/env";
import { HydratedDocument } from "mongoose";
import { checkUserStatus } from "../../utils/checkUserStatus";
import { sendEmail } from "../../utils/sendEmail";
import { Response } from "express";
import { setAuthCookie } from "../../utils/setCookie";
import { generateToken } from "../../utils/jwt";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
    refreshToken,
  };
};

const changePassword = async (
  oldPass: string,
  newPass: string,
  confirmNewPass: string,
  decodedToken: JwtPayload
) => {
  const user = (await User.findById(decodedToken.userId).select(
    "+password"
  )) as HydratedDocument<IUser>;

  if (!user.password) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "User don't have a password.Please set a password first."
    );
  }
  if (!oldPass) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "Please provide current password."
    );
  }
  if (!newPass) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "Please provide a new password."
    );
  }
  if (!confirmNewPass) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "Please provide confirmed password."
    );
  }

  const oldPassMatching = await bcrypt.compare(
    oldPass,
    user.password as string
  );

  if (!oldPassMatching) {
    throw new AppError(
      HttpStatusCodes.UNAUTHORIZED,
      "Old Password does not match"
    );
  }

  if (oldPass === newPass) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "Please set a new password!"
    );
  }

  if (newPass !== confirmNewPass) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "New password and confirmation do not match."
    );
  }

  user.password = await bcrypt.hash(newPass, Number(envVars.BCRYPT_SALT_ROUND));

  await user.save();
};

const setPassword = async (userId: string, password: string) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "User not found");
  }

  if (user.password) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "You have already set your password. Now you can change the password from your profile password update"
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;

  user.auths = auths;

  await user.save();
};

const forgotPassword = async (res: Response, email: string) => {
  const user = (await User.findOne({ email }).select(
    "+password"
  )) as HydratedDocument<IUser>;

  checkUserStatus(user);

  if (!user.password) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "You didn't set any password previously."
    );
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const resetToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    "10m"
  );

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Forgot Password?",
    templateName: "forgotPassword",
    templateData: {
      name: user.name,
      resetUILink,
    },
  });

  setAuthCookie(res, { forgotPassToken: resetToken });
};

const resetPassword = async (
  res: Response,
  userId: string,
  newPass: string,
  confirmNewPass: string,
  decodedToken: JwtPayload
) => {
  if (userId != decodedToken.userId) {
    throw new AppError(
      HttpStatusCodes.UNAUTHORIZED,
      "Sorry! You can reset only your password."
    );
  }
  const user = (await User.findById(decodedToken.userId).select(
    "+password"
  )) as HydratedDocument<IUser>;

  if (!newPass) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "Please provide a new password."
    );
  }
  if (!confirmNewPass) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "Please provide confirmed password."
    );
  }
  if (newPass !== confirmNewPass) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "New password and confirmation does not match."
    );
  }
  user.password = await bcrypt.hash(newPass, Number(envVars.BCRYPT_SALT_ROUND));

  await user.save();

  await res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
};

export const AuthServices = {
  getNewAccessToken,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
};
