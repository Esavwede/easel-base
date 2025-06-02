import ApiError from "../../../../../shared/middleware/errors/api-error"
import User from "../models/User.model"

class UserRepo {
  static async findUserByEmail(email: string) {
    try {
      return await User.findOne({ email }, { _id: 1 })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e)
      throw new ApiError("Server Encountered Error While Finding User", 500)
    }
  }
}

console.log(UserRepo)
