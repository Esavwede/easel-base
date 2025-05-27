import pinoLogger from "pino-http"
import logger from "../../../../core/logging/logger"

const devHttpLogger = pinoLogger({
  logger,
  customLogLevel(req, res, error) {
    if (res.statusCode >= 500) return "error"
    if (res.statusCode >= 400) return "warn"
    return "info"
  },
  customSuccessMessage(req, res, responseTime) {
    return `${req.method} ${req.url} ${res.statusCode} ${responseTime} ms`
  },
})

export default devHttpLogger
