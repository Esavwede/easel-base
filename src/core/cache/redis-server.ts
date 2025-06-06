import Redis from "ioredis"
import logger from "../logging/logger"

let redis: Redis | null = null

export default async function connectToRedisServer() {
  try {
    redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

    // Await Redis Connection
    await new Promise((resolve, reject) => {
      if (redis) {
        redis.on("connecting", () => {
          logger.info("Connecting to Redis server...")
        })

        redis.on("connect", () => {
          logger.info("Connected to Redis server")
        })
        redis.on("ready", () => {
          logger.info("Redis server is ready")
          resolve(true)
        })

        redis.on("error", (e) => {
          logger.error("Redis server error:", e)
          reject(e)
        })
      } else {
        logger.error("Redis client is not initialized")
        reject(new Error("Redis client is not initialized"))
      }
    })

    redis.on("close", () => {
      logger.info("Redis server connection closed")
    })

    redis.on("reconnecting", () => {
      logger.info("Reconnecting to Redis server...")
    })

    redis.on("end", () => {
      logger.info("Redis server connection ended")
    })
  } catch (e) {
    logger.error("Error connecting to Redis server:", e)
    throw e
  }
}

export async function closeRedisConnection() {
  if (redis) {
    await redis.quit()
    logger.info("Redis connection closed")
    redis = null
  } else {
    logger.warn("No Redis connection to close")
  }
}

export { redis }
