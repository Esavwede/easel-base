import express from "express";
import cors from "./shared/middleware/security/cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";

const app = express();

// Security
app.use(cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health checks
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

export default app;
