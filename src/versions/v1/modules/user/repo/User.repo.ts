import pino from "pino"
import ApiError from "../../../../../shared/middleware/errors/api-error"
import User from "../models/User.model"

class UserRepo {
  static async findUserByEmail(email: string, logger: pino.Logger) {
    try {
      return await User.findOne({ email }, { _id: 1 })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      logger.error("COULD NOT FIND USER BY EMAIL", {
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
}

export default UserRepo
