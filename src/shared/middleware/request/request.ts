import { Request, Response, NextFunction } from "express-serve-static-core"
import { v4 as uuidv4 } from "uuid"
import pino from "pino"

declare module "express-serve-static-core" {
  interface Request {
    requestId: string
  }
}

export function ensureRequestIdInRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let requestId = req.headers["x-request-id"] || uuidv4()
  if (Array.isArray(requestId)) {
    requestId = requestId[0]
  }
  req.headers["x-request-id"] = requestId
  res.setHeader("x-request-id", requestId)
  req.requestId = requestId // Optionally assign to req for easier access
  next()
}
