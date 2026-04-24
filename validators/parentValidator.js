import z from "zod";

export const parentNameSchema = z
  .string()
  .min(2, "Parent name must be at least 2 characters long")
  .max(100, "Parent name must be maximum 100 characters long")
  .regex(
    /^(?!(?:.* ){5,})[a-zA-Z ]+$/,
    "Parent name must contain only letters and maximum two spaces",
  );
