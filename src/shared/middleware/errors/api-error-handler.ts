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
  const { message, code, statusCode } = e

  switch (statusCode) {
    case 400:
      return res.status(400).json({
        status: "error",
        error: { message, code },
      })

    case 500:
      return res.status(500).json({
        status: "error",
        error: { message, code },
      })

    default:
      logger.warn("UNKNOWN_SERVER_ERROR")
      logger.error(e)
      return res.status(500).json({ success: false, msg: "Server Error" })
  }
}
