import { Request, Response, NextFunction } from "express"
import crypto from "crypto"
import ApiError from "./api-error"
import logger from "../../../core/logging/logger"

export default function apiErrorHandler(
  error: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): any {
  const e = error as ApiError

  switch (e.statusCode) {
    case 500:
      // const errorMetadata = {
      //   status: "error",
      //   code: e.statusCode,
      //   message: "Internal Server Error",
      //   correlationId: req.get("X-Correlation-ID") || crypto.randomUUID(),
      // }

      logger.error(e.message, { ...e.data })

      return res.status(500).json({ success: false, msg: "server error" })
    default:
      logger.warn("UNKNOWN_SERVER_ERROR", e.data)
      console.error(e)
      return res.status(500).json({ success: false, msg: "Server Error" })
  }
}
