import { redis } from "../../../../../core/cache/redis-server"

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
}
