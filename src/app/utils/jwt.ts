import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
// import AppError from "../errorHelpers/AppError";
// import { HttpStatusCodes } from "./httpStatusCodes";

const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
};

export { generateToken, verifyToken };
