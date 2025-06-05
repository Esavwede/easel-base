import { z } from "zod"

export const findUserByEmailSchema = z.object({
  email: z
    .string({
      invalid_type_error: "email must be of type string",
      required_error: "email required",
    })
    .email("Invalid Email Format")
    .min(6, "email must be at least 6 character long")
    .max(254, "email must not exceed 254 characters")
    .toLowerCase()
    .trim(),
})

export const signupSchema = z
  .object({
    firstname: z
      .string({
        invalid_type_error: "firstname must be of type string",
        required_error: "firstname required",
      })
      .regex(
        /^[a-zA-Z'-]+$/,
        "First name can only contain letters, apostrophes, or dashes",
      )
      .min(2, "firstname must be at least 2 characters long")
      .max(50, "firstname must not exceed 50 characters")
      .toLowerCase()
      .trim(),
    lastname: z
      .string({
        invalid_type_error: "firstname must be of type string",
        required_error: "firstname required",
      })
      .regex(
        /^[a-zA-Z'-]+$/,
        "First name can only contain letters, apostrophes, or dashes",
      )
      .min(2, "firstname must be at least 2 characters long")
      .max(50, "firstname must not exceed 50 characters")
      .toLowerCase()
      .trim(),
    email: z
      .string({
        invalid_type_error: "email must be of type string",
        required_error: "email required",
      })
      .email("Invalid Email Format")
      .min(6, "email must be at least 6 characters long")
      .max(254, "email must not exceed 254 characters")
      .toLowerCase()
      .trim(),
    password: z
      .string({
        invalid_type_error: "password must be of type string",
        required_error: "password required",
      })
      .min(8, "password must be at least 8 characters long")
      .max(128, "password must not exceed 128 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

// Types
export type findUserByEmail = z.infer<typeof findUserByEmailSchema>
export type signup = z.infer<typeof signupSchema>
export type newUser = Omit<signup, "confirmPassword">
