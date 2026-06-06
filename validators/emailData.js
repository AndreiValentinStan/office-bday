import z from "zod";

export const emailData = z.object({
  to: z.email("Recipient`s email address must be valid").array(),
  subject: z
    .string()
    .min(0)
    .max(500, "Email`s subject can`t be longer than 500 chars"),
  body: z
    .string("Email body must be of type string")
    .min(0)
    .max(2000, "Email body can`t be longer than 2000 characters!"),
});
