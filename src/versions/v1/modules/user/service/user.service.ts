import pino from "pino"
import UserRepo from "../repo/User.repo"

class UserService {
  static async findUserByEmail(email: string, logger: pino.Logger) {
    const user = await UserRepo.findUserByEmail(email, logger)
    return user
  }
}

export default UserService
