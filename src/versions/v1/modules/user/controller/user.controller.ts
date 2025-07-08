import { Request, Response, NextFunction } from "express"
import { findUserByEmail } from "../validation/user.schema"
import UserService from "../service/user.service"
import { signinReqBody } from "../validation/signin.schema"

import { strict } from "assert"

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

  static async signinUser(req: Request, res: Response, next: NextFunction) {
    try {
      const logger = req.log.child({})

      const { email, password }: signinReqBody = req.body
      const user = await UserService.signInUser(email, password, logger)

      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.status(200).json({ status: "success", data: user.userData })
    } catch (e: any) {
      next(e)
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const logger = req.log.child({})
      const { refreshToken } = req.cookies

      const tokens = await UserService.refreshToken(refreshToken, logger)

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res
        .status(200)
        .json({ status: "success", accessToken: tokens.accessToken })
    } catch (e: any) {
      next(e)
    }
  }

  static async signout(req: Request, res: Response, next: NextFunction) {
    try {
      const logger = req.log.child({ userId: req.user.userId })

      logger.info("Signing out user")
      const { refreshToken } = req.cookies
      const user = req.user

      if (refreshToken && user) {
        // invalidate session
      }

      logger.info("User signed out successfully")
      res.clearCookie("refreshToken")
      res.status(200).json({ status: "success", message: "signout successful" })
    } catch (e: any) {
      next(e)
    }
  }
}
