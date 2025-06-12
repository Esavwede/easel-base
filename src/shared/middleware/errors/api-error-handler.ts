import { Request, Response, NextFunction } from "express"
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
  const { message, statusCode } = e

  switch (statusCode) {
    case 401:
      return res.status(401).json({
        success: false,
        message,
      })
    case 500:
      return res.status(500).json({
        success: false,
        message,
      })

    case 429:
      return res.status(429).json({
        success: false,
        message,
      })

    default:
      logger.warn("UNKNOWN_SERVER_ERROR")
      logger.error(e)
      return res.status(500).json({ success: false, msg: "Server Error" })
  }
}
