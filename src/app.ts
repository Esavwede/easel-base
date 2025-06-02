import express from "express"
import helmet from "helmet"
import compression from "compression"
import cors from "./shared/middleware/security/cors"
import server404ErrorHandler from "./shared/middleware/errors/server-404-handler"
import apiErrorHandler from "./shared/middleware/errors/api-error-handler"
import v1Routes from "./versions/v1/modules/routes.v1"
import attachContextualHttpLoggerToRequest from "./shared/middleware/logging/http-logger"
import { ensureRequestIdInRequest } from "./shared/middleware/request/request"

const app = express()

// Security
app.use(cors)
app.use(helmet())

// Performance
app.use(compression())

// Request Parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(ensureRequestIdInRequest)
app.use(attachContextualHttpLoggerToRequest)

// Versioned Routes
v1Routes(app)

// Health checks
app.get("/health", (req, res) => {
  const logger = req.log.child({ contextualDetail: "contextual detail" })
  logger.info("")
  res.status(200).json({ status: "UP" })
})

// Error Handlers
app.use(server404ErrorHandler)
app.use(apiErrorHandler)

export default app
