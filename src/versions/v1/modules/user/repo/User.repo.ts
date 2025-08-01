import pino from "pino"
import ApiError from "../../../../../shared/middleware/errors/api-error"
import User from "../models/User.model"
import { newUser } from "../validation/user.schema"
import { SignInDto } from "../dtos/signin.dto"

class UserRepo {
  static async findUserByEmail(email: string, logger: pino.Logger) {
    try {
      logger.debug("User_Repo: Executing search query")

      const user = await User.findOne({ email }, { _id: 1 })
      return user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      logger.error("User_Repo: Error", {
        layer: "UserRepo",
        action: "FIND USER BY EMAIL",
      })

      throw new ApiError(
        500,
        "SIGN_UP_ERROR",
        "An unexpected error occurred while processing your request",
      )
    }
  }

  static async createUser(userData: newUser, logger: pino.Logger) {
    try {
      logger.debug("User_Repo: Executing create user query")

      await User.create(userData)
    } catch (e: any) {
      logger.error("User_Repo: Error", {
        layer: "UserRepo",
        action: "CREATE USER",
      })

      throw new ApiError(
        500,
        "SIGN_UP_ERROR",
        "An unexpected error occurred while processing your request",
      )
    }
  }

  static async getUser(email: string): Promise<SignInDto | null> {
    try {
      return await User.findOne(
        { email },
        {
          _id: 1,
          email: 1,
          firstname: 1,
          lastname: 1,
          role: 1,
          isEmailVerified: 1,
          isDeleted: 1,
          password: 1,
          comparePassword: 1,
        },
      )
    } catch (e: any) {
      throw new ApiError(
        500,
        "SIGN_IN_ERROR",
        "An unexpected error occurred while processing your request",
      )
    }
  }

  static async findUserById(_id: string, logger: pino.Logger) {
    try {
      logger.debug("User_Repo: Executing search query")

      const user = await User.findOne(
        { _id },
        {
          _id: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
          isEmailVerified: 1,
        },
      )
      return user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      logger.error("User_Repo: Error", {
        layer: "UserRepo",
        action: "FIND USER BY ID",
      })

      throw new ApiError(
        500,
        "FIND_USER_BY_ID_ERROR",
        "An unexpected error occurred while processing your request",
      )
    }
  }
}

export default UserRepo
