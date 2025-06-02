import pinoLogger from "pino-http"
import logger from "../../../../core/logging/logger"
import { v4 as uuidv4 } from "uuid"

const devHttpLogger = pinoLogger({
  logger,
  customLogLevel(req, res, error) {
    if (res.statusCode >= 500) return "error"
    if (res.statusCode >= 400) return "warn"
    return "info"
  },
  customProps: (req, res) => ({
    requestId: req.headers["x-request-id"] || uuidv4(),
    ip: req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress,
    path: req.url,
    method: req.method,
  }),
  customSuccessMessage(req, res, responseTime) {
    return `${req.method} ${req.url} ${res.statusCode} ${responseTime}ms`
  },
})

export default devHttpLogger
