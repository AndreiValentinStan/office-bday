import errorHandler from "@/utils/errorHandler";
import { CustomError } from "@/utils/CustomError";
import { METHOD_NOT_ALLOWED } from "http-status-codes";
import { resetToken } from "@/validators/resetToken";
import z from "zod";
import crypto from 'node:crypto';

export async function POST(req) {
  try {
    if (req.method !== "POST")
      throw new CustomError("Only POST method accepted", METHOD_NOT_ALLOWED);

    const token = z.object({ token: resetToken }).parse(await req.json());

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // get token row from DB
    // hashedToken used as key in password_token table
    const tokenRecord = 'SELECT * FROM password_token WHERE token=${hashedToken}';

    // check if token:
    // - is not empty
    // - is not expired
    // - is not used


  } catch (err) {
    return errorHandler(err);
  }
}
