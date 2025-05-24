import { config } from "dotenv"
import AppConfig from "config"
config()

import mongoose from "mongoose"

async function startDatabase() {
  try {
    /**TRACK CONNECTION LIFE CYCLE */
    const db = mongoose.connection

    db.on("connecting", () => {
      console.log("Connecting To Database... 🔌")
    })

    db.on("connected", () => {
      console.log("Connected To Database Successfully ✅")
    })

    db.on("disconnecting", () => {
      console.log("Database Disconnecting...⚠️")
    })

    db.on("disconnected", () => {
      console.log("Database Disconnected ❌")
    })

    db.on("error", (e) => {
      console.error("DATABASE_ERROR💥:", e)
    })

    db.on("close", () => {
      console.log("Database Connection Closed 🛑")
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
    console.log("Error Occured while Starting application database")
    console.log(e)
  }
}

export default startDatabase
