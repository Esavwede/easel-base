import { Request, Response, NextFunction } from "express"
import { findUserByEmail, newUser } from "../validation/user.schema"
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
        res.status(404).json({
          success: result.success,
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

  static async signupUser(req: Request, res: Response, next: NextFunction) {
    try {
      const logger = req.log.child({
        user: {
          email: req.body.email,
        },
      })

      const { firstname, lastname, email, password } = req.body
      const userData = { firstname, lastname, email, password }

      const signupResult = await UserService.signupUser(userData, logger)

      res.status(201).json({
        success: signupResult.success,
        message: signupResult.message,
      })
    } catch (e: any) {
      next(e)
    }
  }
}
