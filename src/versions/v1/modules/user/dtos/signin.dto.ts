export interface SignInDto {
  _id: string
  email: string
  password: string
  role: string
  isEmailVerified: boolean
  isDeleted: boolean
  comparePassword(candidatePassword: string): Promise<boolean>
}
