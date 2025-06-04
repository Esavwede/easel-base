import pino from "pino"
import UserRepo from "../repo/User.repo"

class UserService {
  static async findUserByEmail(email: string, logger: pino.Logger) {
    logger.debug("User_Service: Finding User by Email")

    const user = await UserRepo.findUserByEmail(email, logger)

    if (!user) {
      logger.info("User_Service: User not found", {
        layer: "UserService",
      })

      return {
        success: false,
        data: null,
        message: "User not found",
      }
    } else {
      logger.info("User_Service: User found", {
        layer: "UserService",
      })

      return {
        success: true,
        data: user,
        message: "User found",
      }
    }
  }
}

export default UserService
