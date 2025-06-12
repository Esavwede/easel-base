export function sanitizeUserData(user: any): any {
  const { password, __v, role, isDeleted, ...sanitizedUser } = user.toObject()
  return sanitizedUser
}
