/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { IErrorSources } from "../interfaces/error.types";
import { HttpStatusCodes } from "../utils/httpStatusCodes";

export const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorSources: IErrorSources[] = [];

  const errors = Object.values(err.errors);

  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );

  return {
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: "Validation Error",
    errorSources,
  };
};
