import express from "express";
import cors from "./shared/middleware/security/cors";
import helmet from "helmet";
import compression from "compression";
import server404ErrorHandler from "./shared/middleware/errors/server-404-handler";
import apiErrorHandler from "./shared/middleware/errors/api-error-handler";
import ApiError from "./shared/middleware/errors/api-error";

const app = express();

// Security
app.use(cors);
app.use(helmet());

// Performance
app.use(compression());

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health checks
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Error Handlers
app.use(server404ErrorHandler);
app.use(apiErrorHandler);

export default app;
