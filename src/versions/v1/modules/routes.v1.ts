import { Router, Application } from "express"
import logger from "../../../core/logging/logger"

export default function (app: Application) {
  const router = Router()

  router.get("/", (req, res) => {
    res.status(200).json({ status: "Easel-Base" })
  })

  logger.info("V1 Routes Loaded")
  app.use("/api/v1/", router)
}
