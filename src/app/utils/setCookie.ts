import { Response } from "express";
import { envVars } from "../config/env";

export interface IAuthTokens {
  creationToken?: string;
  verifiedCreationToken?: string;
  accessToken?: string;
  refreshToken?: string;
  forgotPassToken?: string;
  inActiveToken?: string;
  blockedToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: IAuthTokens) => {
  if (tokenInfo.creationToken) {
    res.cookie("creationToken", tokenInfo.creationToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production" ? true : false,
      sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    });
  }
  if (tokenInfo.verifiedCreationToken) {
    res.clearCookie("creationToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.cookie("verifiedCreationToken", tokenInfo.verifiedCreationToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production" ? true : false,
      sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    });
  }
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production" ? true : false,
      sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production" ? true : false,
      sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    });
  }

  if (tokenInfo.forgotPassToken) {
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
    res.cookie("accessToken", tokenInfo.forgotPassToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production" ? true : false,
      sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    });
  }

  if (tokenInfo.inActiveToken) {
    res.cookie("inActiveToken", tokenInfo.inActiveToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production" ? true : false,
      sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    });
  }
  if (tokenInfo.blockedToken) {
    res.cookie("blockedToken", tokenInfo.blockedToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production" ? true : false,
      sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    });
  }
};
