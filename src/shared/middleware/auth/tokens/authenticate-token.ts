import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { redis } from "../../../../core/cache/redis-server"
import logger from "../../../../core/logging/logger"

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export default async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "no access token provided" })

    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const sessionKey = `refresh_token:${decoded._id}:${decoded.sessionId}`
    const sessionExists = await redis?.exists(sessionKey)

    if (!sessionExists) {
      logger.warn("Session does not exist for user")
      logger.info(decoded)
      res.status(403).json({ success: false, message: "forbidden" })
      return
    }

    req.user = decoded
    logger.info("token validation passed")
    next()
  } catch (e) {
    logger.info("token validation failed")
    res.status(403).json({ success: false, message: "forbidden" })
    return
  }
}
