import z from "zod";

export const firstNameSchema = z
  .string()
  .min(2, "First Name must be at least 2 characters long")
  .max(50, "First Name must be less than 50 characters long")
  .regex(/^[a-zA-Z]+$/, "First name must contain only letters");
