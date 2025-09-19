/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

type AsyncHandler<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

export const catchAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: unknown) => {
      if (err instanceof Error) {
        console.error("💥 Async Error:", err.message);
      } else {
        console.error("💥 Async Error (unknown):", err);
      }
      next(err);
    });
  };
};
