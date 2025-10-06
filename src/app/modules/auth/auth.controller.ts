/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatusCodes } from "../../utils/httpStatusCodes";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { createUserTokens } from "../../utils/userTokens";
import { IAuthTokens, setAuthCookie } from "../../utils/setCookie";
import { envVars } from "../../config/env";
import { AuthServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(HttpStatusCodes.UNAUTHORIZED, err));
      }

      if (!user) {
        return next(new AppError(HttpStatusCodes.UNAUTHORIZED, info.message));
      }

      const userTokens = createUserTokens(user);

      const { password, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: HttpStatusCodes.OK,
        message: "User logged in successfully",
        data: {
          acceessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

const googleLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })(req, res, next);
  }
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      {
        failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!`,
        session: true,
      },
      async (err: any, user: any, info: any) => {
        if (err) {
          return next(new AppError(HttpStatusCodes.UNAUTHORIZED, err));
        }
        if (!user) {
          console.log("Authentication failed:", info.message);
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            success: false,
            message: info.message,
          });
        }

        req.login(user, async (loginErr) => {
          if (loginErr) {
            return next(new AppError(HttpStatusCodes.UNAUTHORIZED, err));
          }
          const tokenInfo = createUserTokens(user);
          setAuthCookie(res, tokenInfo);

          res.redirect(`${envVars.FRONTEND_URL}`);
        });
      }
    )(req, res, next);
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        HttpStatusCodes.BAD_REQUEST,
        "No refresh token recieved from cookies"
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "New Access Token Retrived Successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "User Logged Out Successfully",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    const confirmNewPass = req.body.confirmNewPass;
    const decodedToken = req.user as JwtPayload;

    await AuthServices.changePassword(
      oldPass,
      newPass,
      confirmNewPass,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const password = req.body.password;
    const decodedToken = req.user as JwtPayload;

    await AuthServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "Password Set Successfully",
      data: null,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    await AuthServices.forgotPassword(req, res, email);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "Email Sent Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const newPass = req.body.newPass;
    const confirmNewPass = req.body.confirmNewPass;
    const decodedToken = req.user as JwtPayload;

    await AuthServices.resetPassword(
      res,
      userId,
      newPass,
      confirmNewPass,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCodes.OK,
      message: "Password Changed Successfully.Please login with new password",
      data: null,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  googleLogin,
  googleCallback,
  getNewAccessToken,
  logout,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
};
