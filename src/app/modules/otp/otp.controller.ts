/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OTPServices } from "./otp.service";
import { sendResponse } from "../../utils/sendResponse";

const sendOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;

    await OTPServices.sendOTP(name, email);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP sent successfully",
      data: null,
    });
  }
);

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await OTPServices.verifyOTP(email, otp);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully",
    data: null,
  });
});

export const OTPControllers = { sendOTP, verifyOTP };
