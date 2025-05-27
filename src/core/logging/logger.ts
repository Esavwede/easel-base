import { config } from "dotenv"
config()
import { Logger } from "pino"
import devLogger from "./devLogger/devLogger"
import prodLogger from "./prodLogger/prodLogger"

const inProduction = process.env.NODE_ENV === "production"
let logger: Logger

if (inProduction) {
  logger = prodLogger
  logger.info("Prod Logger Initialized")
}
{
  logger = devLogger
  logger.info("Dev Logger Initialized")
}

export default logger
