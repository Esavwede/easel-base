import { Request, Response, NextFunction } from "express"

class UserController {
  static findUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const logger = req.log.child({
        layer: "USER CONTROLLER",
        action: "FIND USER BY EMAIL",
      })

      logger.info("Finding User by Email")
    } catch (e: any) {
      next(e)
    }
  }
}
