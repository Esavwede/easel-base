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

export type findUserByEmail = z.infer<typeof findUserByEmailSchema>
