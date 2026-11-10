import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string({ error: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be at most 100 characters"),

  unique_name: z
    .string({ error: "Username is required" })
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),

  email: z.string({ error: "Email is required" }).email("Invalid email format"),

  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one number, and one special character (@$!%*?&)",
    ),

  age: z.coerce
    .number({ error: "Age is required and must be a number" })
    .min(18, "You must be at least 18 years old"),

  phoneNumber: z.string().optional(),

  gender: z.coerce.number().optional(),
});

export const loginSchema = z.object({
  email: z.string({ error: "Email is required" }).email("Invalid email format"),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});