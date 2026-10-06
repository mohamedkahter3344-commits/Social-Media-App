import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one capital letter")
    .regex(/[a-z]/, "Password must contain at least one small letter")
    .regex(/[0-9]/, "Password must contain at  one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at  least one character"),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;
