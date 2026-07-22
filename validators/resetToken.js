// token sent to user email in order to reset password
// sent as plain text, 128 bytes long, BASE 64 encoding

import {z} from "zod";

export const resetToken = z
  .string()
  .regex(/^[0-9a-fA-F]+$/, { message: "Invalid hex format" })
  .length(256, {error: "Token len must be 256"});
