import mongoose, { Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"
import logger from "../../../../../core/logging/logger"

export interface IUser extends Document {
  firstname: string
  lastname: string
  email: string
  password: string
  role: "user" | "admin"
  isEmailVerified: boolean
  isDeleted: boolean
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "firstname must be at least 2 characters"],
      maxlength: [50, "firstname cannot exceed 50 characters"],
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "lastname must be at least 2 characters"],
      maxlength: [50, "lastname cannot exceed 50 characters"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

UserSchema.pre("save", async function (next) {
  const user = this

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    return bcrypt.compare(candidatePassword, this.password)
  } catch (e: any) {
    logger.error(e, "BCRYPT_PASSWORD_VALIDATION_ERROR")
    throw new Error("INTERNAL SERVER ERROR")
  }
}

const User = mongoose.model("User", UserSchema)
export default User
