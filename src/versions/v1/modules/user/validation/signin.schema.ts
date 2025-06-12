import { z } from "zod"

export const signinSchema = z.object({
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
})

// Types

export type signinReqBody = z.infer<typeof signinSchema>
