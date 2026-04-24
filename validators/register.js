import z from "zod";
import { passwordSchema } from "./passwordSchema";
import { phoneSchema } from "./phone";


export const emailSchema = z.email('Please provide an valid email');

export const registerDataSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.preprocess(arg => arg === '' ? undefined : arg, phoneSchema.optional()),
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
