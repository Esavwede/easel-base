import pino from "pino"
import UserRepo from "../repo/User.repo"
import { newUser } from "../validation/user.schema"
import AuthService from "../utils/auth-service.utils"
import ApiError from "../../../../../shared/middleware/errors/api-error"
import sendWelcomeEmail from "../utils/send-welcome-mail.util"
import logger from "../../../../../core/logging/logger"
import jwt from "jsonwebtoken"
import { redis } from "../../../../../core/cache/redis-server"

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

  static async signInUser(
    email: string,
    password: string,
    logger: pino.Logger,
  ) {
    var user = await UserRepo.getUser(email)
    if (!user) {
      logger.warn("User_Service: User not found")
      throw new ApiError(401, "INCORRECT_DETAILS", "check sign in details")
    }

    const isLocked = await AuthService.checkAccountLock(user._id)
    if (isLocked) {
      logger.warn("Account Locked. Cannot signin user at this time.")
      throw new ApiError(429, "TOO_MUCH", "too many login attempts")
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      // increment login attempts
      AuthService.incrementSigninAttempts(user._id)
      logger.warn("Invalid password submitted")
      throw new ApiError(401, "CHECK_AUTH_DETAILS", "check signin details")
    }

    // clear signin attempts
    const sessionId = AuthService.generateSessionId()

    const payload = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      sessionId,
    }

    const { accessToken, refreshToken } = AuthService.generateTokens(payload)

    await AuthService.storeRefreshToken(refreshToken, payload._id, sessionId)

    const userData = {
      success: true,
      data: {
        user: payload,
        accessToken,
      },
    }

    return { userData, refreshToken }
  }

  static async refreshToken(token: string, logger: pino.Logger) {
    try {
      logger.info("refreshing token")

      if (!token) {
        logger.warn("Token not provided")
        throw new ApiError(
          401,
          "Refresh Token Expired",
          "Refresh Token Expired",
        )
      }

      // decode token
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any

      // extract userid and session id from token
      const { userId, sessionId } = decoded

      // get stored token with userid and sessionid
      const storedToken = await redis?.get(
        `refresh_token:${userId}:${sessionId}`,
      )

      // if null return null result
      if (!token || token !== storedToken) {
        throw new ApiError(
          401,
          "Invalid Refresh Token",
          "Invalid Refresh Token",
        )
      }

      // get user
      const user = await UserRepo.findUserById(userId, logger)

      if (!user) {
        throw new ApiError(
          500,
          "SERVER_ERROR",
          "error encountered while processing request",
        )
      }
      // create new session id
      let newSessionId = AuthService.generateSessionId()

      // create new payload
      const payload = {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        sessionId,
      }

      // create new tokens
      const { accessToken, refreshToken } = AuthService.generateTokens(payload)

      // invalidate session
      await AuthService.invalidateSession(userId, sessionId)

      // store refresh token
      await AuthService.storeRefreshToken(refreshToken, userId, newSessionId)

      return { accessToken, refreshToken }
    } catch (e: any) {
      throw e
    }
  }
}

export default UserService
