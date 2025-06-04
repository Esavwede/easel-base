import { Request, Response, NextFunction } from "express"
import { findUserByEmail } from "../validation/user.schema"
import UserService from "../service/user.service"

export default class UserController {
  static async findUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    req.setTimeout(5000)
    try {
      const logger = req.log.child({
        user: {
          email: req.body.email,
        },
      })

      const { email }: findUserByEmail = req.body

      logger.debug("User_Controller: Finding User by Email")
      const result = await UserService.findUserByEmail(email, logger)

      if (!result.success) {
        logger.info("User_Controller: User not found")
        res.status(200).json({
          success: result.success,
          data: result.data,
          message: result.message,
        })
        return
      }

      logger.info("User_Controller: User found")
      res.status(200).json({
        success: result.success,
        data: result.data,
        message: result.message,
      })
    } catch (e: any) {
      next(e)
    }
  }
}
