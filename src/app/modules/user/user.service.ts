import { envVars } from "./../../config/env";
import AppError from "../../errorHelpers/AppError";
import { HttpStatusCodes } from "../../utils/httpStatusCodes";
import { setAuthCookie } from "../../utils/setCookie";
import { OTPServices } from "../otp/otp.service";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { generateToken, verifyToken } from "../../utils/jwt";
import { Response } from "express";
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { RedisServices } from "../redis/redis.service";
import { HydratedDocument } from "mongoose";
import { geocodeAddress } from "../../utils/geoApiFy";

const createUserRequest = async (
  res: Response,
  name: string,
  email: string
) => {
  if (!name) {
    throw new AppError(HttpStatusCodes.BAD_REQUEST, "Please Enter Your Name");
  }
  if (!email) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "Please enter a valid email address!"
    );
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(HttpStatusCodes.BAD_REQUEST, "User already exists");
  }

  const sub = "Account Verification Code";
  const temp = "accountVerificationOtp";
  const tempData = {
    name,
  };
  const OTP_EXPIRATION = 2 * 60;

  await OTPServices.sendOTP(email, sub, temp, tempData, OTP_EXPIRATION);

  const jwtPayload = {
    name: name,
    email: email,
  };

  const creationToken = generateToken(
    jwtPayload,
    envVars.JWT_CREATION_SECRET,
    envVars.JWT_CREATION_EXPIRES
  );

  if (!creationToken) {
    throw new AppError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create CREATION_TOKEN"
    );
  }

  setAuthCookie(res, { creationToken: creationToken });
};

const createUserVerification = async (
  res: Response,
  creationToken: string,
  otp: string
) => {
  if (!creationToken) {
    throw new AppError(
      HttpStatusCodes.UNAUTHORIZED,
      "No CREATION_TOKEN recieved"
    );
  }

  const verifiedToken = verifyToken(
    creationToken,
    envVars.JWT_CREATION_SECRET
  ) as JwtPayload;

  const { name, email } = verifiedToken;

  if (!name || !email) {
    throw new AppError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to decode Name and Email from CREATION_TOKEN"
    );
  }

  await OTPServices.verifyOTP(email, otp);

  const jwtPayload = {
    name: name,
    email: email,
  };

  const verifiedCreationToken = generateToken(
    jwtPayload,
    envVars.JWT_VERIFIED_CREATION_SECRET,
    envVars.JWT_VERIFIED_CREATION_EXPIRES
  );

  if (!verifiedCreationToken) {
    throw new AppError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create VERIFIED_CREATION_TOKEN"
    );
  }

  setAuthCookie(res, { verifiedCreationToken: verifiedCreationToken });
};

const createUserSuccess = async (
  res: Response,
  verifiedCreationToken: string,
  payload: Partial<IUser>
) => {
  if (!verifiedCreationToken) {
    throw new AppError(
      HttpStatusCodes.UNAUTHORIZED,
      "No VERIFIED_CREATION_TOKEN received.Please verify your email first!"
    );
  }

  const verifiedToken = verifyToken(
    verifiedCreationToken,
    envVars.JWT_CREATION_SECRET
  ) as JwtPayload;

  const { name, email } = verifiedToken;

  if (!name || !email) {
    throw new AppError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to decode Name and Email from VERIFIED_CREATION_TOKEN"
    );
  }
  const { password, ...rest } = payload;

  if (!password) {
    throw new AppError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Plase set a password"
    );
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    auths: [authProvider],
    isVerified: true,
    ...rest,
  });

  res.clearCookie("verifiedCreationToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return user;
};

const getAllUsers = async () => {
  const users = User.find();
  return users;
};

const getSingleUser = async (userId: string) => {
  const user = User.findById(userId);
  return user;
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "User not found");
  }
  return {
    data: user,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "User Not Found");
  }

  if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(
        401,
        "It looks like you're trying to edit another user's profile. You can only make changes to your own profile."
      );
    }
  }

  if (payload.role && payload.role === Role.ADMIN) {
    if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(
        HttpStatusCodes.FORBIDDEN,
        "Setting up Admin role is a restricted action. For security, only users with an existing Admin role can assign it to others."
      );
    }
  }

  if (payload.role && payload.role === Role.DRIVER) {
    if (!payload.vehicleInfo) {
      throw new AppError(
        HttpStatusCodes.BAD_REQUEST,
        "If you want to update your role to DRIVER,you must have to give your vehicle information"
      );
    }
  }

  if (
    payload.vehicleInfo?.isDriverApproved &&
    decodedToken.role !== Role.ADMIN
  ) {
    throw new AppError(
      HttpStatusCodes.BAD_REQUEST,
      "You can't set your driving approval status by yourself.Please submit your vehicle information or if you have already submitted then plese wait for 1-2 business days. We will inform after we finish checking your vehicle information."
    );
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(
        HttpStatusCodes.FORBIDDEN,
        "This is a restricted action. For security, only Admin can update these information."
      );
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const deleteUser = async (userId: string) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist || isUserExist.isDeleted) {
    throw new AppError(HttpStatusCodes.NOT_FOUND, "User Not Found");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    {
      new: true,
    }
  );

  return user;
};

const setVehicleLocation = async (
  decodedToken: JwtPayload,
  address: string
) => {
  const driverId = decodedToken.userId;
  const driver = (await User.findById(driverId)) as HydratedDocument<IUser>;
  console.log(address);
  const addressCo = await geocodeAddress(address);

  if (!addressCo) {
    throw new AppError(
      HttpStatusCodes.NOT_FOUND,
      "Sorry! Couldn't find your location"
    );
  }

  const lng = Number(addressCo.longitude);
  const lat = Number(addressCo.latitude);
  const add = addressCo.address;
  console.log(lng, lat, add);

  await RedisServices.setVehicleLocation(driverId, lng, lat);

  driver.vehicleInfo.vehicleLocation = {
    coordinates: {
      lng: addressCo.longitude,
      lat: addressCo.latitude,
    },
    address: addressCo.address,
  };

  await driver.save();

  return { driver };
};

export const UserServices = {
  createUserRequest,
  createUserVerification,
  createUserSuccess,
  getAllUsers,
  getSingleUser,
  getMe,
  updateUser,
  deleteUser,
  setVehicleLocation,
};
