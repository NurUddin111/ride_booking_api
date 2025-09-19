/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
import httpStatus from "http-status-codes";

export enum HttpStatusCodes {
  // ✅ Success
  OK = httpStatus.OK,
  CREATED = httpStatus.CREATED,
  NO_CONTENT = httpStatus.NO_CONTENT,

  // ⚠️ Client errors
  BAD_REQUEST = httpStatus.BAD_REQUEST,
  UNAUTHORIZED = httpStatus.UNAUTHORIZED,
  FORBIDDEN = httpStatus.FORBIDDEN,
  NOT_FOUND = httpStatus.NOT_FOUND,
  CONFLICT = httpStatus.CONFLICT,

  // 🔥 Server errors
  INTERNAL_SERVER_ERROR = httpStatus.INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE = httpStatus.SERVICE_UNAVAILABLE,
}
