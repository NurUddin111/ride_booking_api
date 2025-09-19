import mongoose from "mongoose";
import { IGenericErrorResponse } from "../interfaces/error.types";
import { HttpStatusCodes } from "../utils/httpStatusCodes";

export const handleCastError = (
  err: mongoose.Error.CastError
): IGenericErrorResponse => {
  return {
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: `Cast Error:${err.message}`,
  };
};
