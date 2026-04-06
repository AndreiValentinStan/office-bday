import z from "zod";

export const lastNameSchema = z
  .string()
  .min(2, "Last Name must be at least 2 characters long")
  .max(50, "Last Name must be less than 50 characters long")
  .regex(/^[a-zA-Z]+$/, "Last name must contain only letters");
