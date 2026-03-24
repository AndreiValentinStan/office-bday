import z from "zod";
import { passwordSchema } from "./passwordSchema";

export const emailSchema = z.email();

export const registerDataSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z
      .string()
      .regex(
        /^(?:\+40|0)(?:[\s-]?\d){9}$/,
        "Phone number must be 10 digits long (can include country prefix)"
      )
      .optional(),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine(
    ({ password, passwordConfirm }) => {
      return password === passwordConfirm;
    },
    {
      error: "Provided passwordsd are different!",
      path: ["Password & Retyped Password"],
    }
  );
