import pinoLogger from "pino-http"
import logger from "../../../../core/logging/logger"

const prodHttpLogger = pinoLogger({
  logger,
  autoLogging: true,
  customLogLevel(req, res) {
    if (res.statusCode >= 500) return "error"
    if (res.statusCode >= 400) return "warn"
    return "info"
  },
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
      }
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      }
    },
  },
})

export default prodHttpLogger
