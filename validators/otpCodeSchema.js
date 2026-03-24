import z from "zod";

export const otpCodeSchema = z
  .string()
  .length(6, "OTP code must be exact 6 digits long")
  .regex(/[0-9]/, "OTP code must contain only digits");
