import { Response } from "express";

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
      secure: true,
      sameSite: "none",
    });
  }
  if (tokenInfo.verifiedCreationToken) {
    res.clearCookie("creationToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("verifiedCreationToken", tokenInfo.verifiedCreationToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  if (tokenInfo.forgotPassToken) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("accessToken", tokenInfo.forgotPassToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  if (tokenInfo.inActiveToken) {
    res.cookie("inActiveToken", tokenInfo.inActiveToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
  if (tokenInfo.blockedToken) {
    res.cookie("blockedToken", tokenInfo.blockedToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
};
