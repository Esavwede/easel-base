import { z } from "zod"

const findUserByEmailSchema = z.object({
  email: z
    .string({
      invalid_type_error: "email must be of type string",
      required_error: "email required",
    })
    .email("Invalid Email Format")
    .max(254, "email must not exceed 254 characters")
    .toLowerCase()
    .trim(),
})

export type findUserByEmail = z.infer<typeof findUserByEmailSchema>
