import mongoose from "mongoose"

export function sanitizeUserData(user: mongoose.Document): any {
  const { password, __v, role, isDeleted, ...sanitizedUser } = user.toObject()
  return sanitizedUser
}
