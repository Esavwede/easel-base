import { redis } from "../../../../../core/cache/redis-server"

export default class AuthService {
  static async checkAccountLock(userId: string): Promise<boolean> {
    const lockKey = `account_lock:${userId}`
    const isLocked = await redis?.get(lockKey)
    return !!isLocked
  }
}
