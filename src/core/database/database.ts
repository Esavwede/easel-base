import { config } from "dotenv"
config()
import AppConfig from "config"
import mongoose from "mongoose"
import logger from "../logging/logger"

async function startDatabase() {
  try {
    /**TRACK CONNECTION LIFE CYCLE */
    const db = mongoose.connection

    db.on("connecting", () => {
      logger.info("Connecting To Database...")
    })

    db.on("connected", () => {
      logger.info("Connected To Database Successfully")
    })

    db.on("disconnecting", () => {
      logger.info("Database Disconnecting...")
    })

    db.on("disconnected", () => {
      logger.info("Database Disconnected")
    })

    db.on("error", (e) => {
      logger.error(e, "DATABASE_ERROR:")
    })

    db.on("close", () => {
      logger.info("Database Connection Closed ")
    })

    /**SETUP CONNECTION CONFIG */
    const DB_URI = process.env.DB_URI || ""
    const connectionOptions = {
      minPoolSize: AppConfig.get<number>("db.options.minPoolSize"),
      maxPoolSize: AppConfig.get<number>("db.options.maxPoolSize"),
      maxIdleTimeMS: AppConfig.get<number>("db.options.maxIdleTimeMS"),
      socketTimeoutMS: AppConfig.get<number>("db.options.socketTimeoutMS"),
      serverSelectionTimeoutMS: AppConfig.get<number>(
        "db.options.serverSelectionTimeoutMS",
      ),
    }

    /**CONNECT */
    await mongoose.connect(DB_URI, connectionOptions)
    return db
  } catch (e: any) {
    logger.error("Error Occured while Starting application database")
    logger.error(e)
  }
}

export default startDatabase
