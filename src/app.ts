import express from "express";
import cors from "./shared/middleware/security/cors";
import helmet from "helmet";
import { xss } from "@blocklet/xss";
import compression from "compression";

const app = express();

// Security
app.use(cors);
app.use(helmet());
app.use(xss());

// Performance
app.use(compression());

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health checks
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

export default app;
