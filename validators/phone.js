import z from "zod";

export const phoneSchema = z
  .string()
  .regex(
    /^(?:\+40|0)(?:[\s-]?\d){9}$/,
    "Phone number must be 10 digits long (can include country prefix)",
  )
  .optional();
