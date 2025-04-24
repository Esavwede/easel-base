import { Request, Response, NextFunction } from "express";
import ApiError from "./api-error";
import crypto from "crypto";

export default function apiErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const e = error as ApiError;

  let response: any = undefined;

  switch (e.statusCode) {
    case 404:
      response = {
        status: "error",
        code: 404,
        message: `Resource not found: ${req.method} ${req.originalUrl}`,
        details: e.message,
      };
      return res.status(400).json(response);

    case 500:
      let correlationId = req.get("X-Correlation-ID") || crypto.randomUUID();
      response = {
        status: "error",
        code: 500,
        message: "Internal Server Error",
        correlationId,
        details: e.message,
      };

      return res.status(500).json(response);
    default:
      // Unknown Server Error
      response = {
        status: "error",
        code: 500,
        message: "Internal Server Error",
        correlationId: req.get("X-Correlation-ID") || crypto.randomUUID(),
        details: "An unexpected error occurred with server: " + e.message,
      };

      console.log("FATAL: UNKNOWN SERVER ERROR");
      return res.status(500).json(response);
  }
}
