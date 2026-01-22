import z from 'zod';

export const passwordSchema = z
  .string()
  .min(8, "Password must br at least 8 characters long!")
  .max(50, "Password must be maximum 50 characters long!")
  .regex(/[a-z]/, "Password must contain at least lower letter")
  .regex(/[A-Z]/, "Password must contain at least one capital letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least special character");
