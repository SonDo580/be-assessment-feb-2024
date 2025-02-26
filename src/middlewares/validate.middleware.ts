import { NextFunction, Request, Response } from "express";
import { SafeParseError, ZodSchema } from "zod";

import { asyncHandler } from "./error.middleware";
import { BadRequestError } from "@/core/http-errors";

/* Helper to generate error message from validation error */
const produceErrorMessage = <T>(result: SafeParseError<T>): string =>
  result.error.errors
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join(", ");

/* Generic request validation middleware */
const validateRequest = <T>(schema: ZodSchema<T>, target: "body" | "query") => {
  return asyncHandler((req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errorMessage: string = produceErrorMessage(result);
      throw new BadRequestError(errorMessage);
    }

    req[target] = result.data;
    next();
  });
};

export const validateRequestBody = <T>(schema: ZodSchema<T>) =>
  validateRequest(schema, "body");

export const validateRequestQuery = <T>(schema: ZodSchema<T>) =>
  validateRequest(schema, "query");
