import logger from "../../../core/logging/logger"
import devHttpLogger from "./dev-http-logger/dev-http-logger"
import prodHttpLogger from "./prod-http-logger/prod-http-logger"

let httpLogger: any

const inProduction = process.env.NODE_ENV === "production"

if (inProduction) {
  logger.info("Initialized Production HTTP Logger")
  httpLogger = prodHttpLogger
} else {
  logger.info("Initialized Development HTTP Logger")
  httpLogger = devHttpLogger
}

export default httpLogger
