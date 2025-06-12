import { redis } from "../../../../../core/cache/redis-server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

export default class AuthService {
  // Properties
  private static readonly MAX_SIGNIN_ATTEMPTS = 3

  static async checkAccountLock(userId: string): Promise<boolean> {
    const lockKey = `account_lock:${userId}`
    const isLocked = await redis?.get(lockKey)
    return !!isLocked
  }

  static async incrementSigninAttempts(userId: string): Promise<void> {
    const attemptsKey = `login_attempts:${userId}`
    const signinAttempts: number | undefined = await redis?.incr(attemptsKey)

    //*** Buggy feature */
    if (typeof signinAttempts !== "number") {
      return
    }

    if (signinAttempts === 1) {
      await redis?.expire(attemptsKey, 900)
    }

    if (signinAttempts > this.MAX_SIGNIN_ATTEMPTS) {
      const lockKey = `account_lock:${userId}`
      await redis?.set(lockKey, "locked", "EX", 900)
    }
  }

  static async generateSessionId() {
    return uuidv4()
  }

  static generateTokens(payload: JwtPayload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15m",
      issuer: "easel-base",
      audience: "app-users",
    })

    const refreshToken = jwt.sign(
      { userId: payload._id, sessionId: payload.sessionId },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d",
        issuer: "easel-base",
        audience: "app-users",
      },
    )

    return { accessToken, refreshToken }
  }
}
