import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health checks
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

export default app;
