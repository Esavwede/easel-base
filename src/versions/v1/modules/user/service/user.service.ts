import pino from "pino"
import UserRepo from "../repo/User.repo"
import { newUser } from "../validation/user.schema"
import { sanitizeUserData } from "../utils/user.utils"
import ApiError from "../../../../../shared/middleware/errors/api-error"
import sendWelcomeEmail from "../utils/send-welcome-mail.util"

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

  static async signupUser(userData: newUser, logger: pino.Logger) {
    try {
      logger.debug("User_Service: Creating User")

      const userFound = await UserRepo.findUserByEmail(userData.email, logger)

      if (userFound) {
        logger.warn("User_Service: User already exists")

        //**Return Successful Response for Security Reasons
        return {
          success: true,
          message: "user created successfully",
        }
      }

      await UserRepo.createUser(userData, logger)

      // Create Email Verification Token
      // Store email verification token in cache
      // Send Verification Email
      await sendWelcomeEmail(userData.email, userData.firstname)

      return {
        success: true,
        message: "User created successfully",
      }
    } catch (e: any) {
      logger.error("User_Service: Error creating user", e)

      throw new ApiError(
        500,
        "Internal Server Error",
        "Error occured while creating user",
      )
    }
  }
}

export default UserService
