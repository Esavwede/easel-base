import { Router, Application } from "express"
import logger from "../../../core/logging/logger"
import UserController from "./user/controller/user.controller"
import validateRequestSchema from "../../../shared/middleware/validation/validation.middleware"
import { findUserByEmailSchema } from "./user/validation/user.schema"

export default function (app: Application) {
  const router = Router()

  router.get("/", (req, res) => {
    res.status(200).json({ status: "Easel-Base" })
  })

  router.post(
    "/user",
    validateRequestSchema({ body: findUserByEmailSchema }),
    UserController.findUserByEmail,
  )
  logger.info("V1 Routes Loaded")
  app.use("/api/v1", router)
}
