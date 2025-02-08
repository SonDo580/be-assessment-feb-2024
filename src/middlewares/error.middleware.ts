import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from 'http-status'

import { HttpError } from "@/core/http-errors";
import { ErrorMessage } from "@/constants/message.const";

/* Catch errors and forward them to error handler.  */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/* Catch-all error handler to return error response */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode =
    err instanceof HttpError ? err.status : httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || ErrorMessage.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    message,
  });
};
