/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericErrorResponse } from "../interfaces/error.types";
import { HttpStatusCodes } from "../utils/httpStatusCodes";

export const handleDuplicateError = (err: any): IGenericErrorResponse => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return {
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: `${value} already exists.`,
  };
};
