import { otpCodeSchema } from "../../../../validators/otpCodeSchema";
import errorHandler from "../../../../utils/errorHandler";
import { redis } from "../../../../db/redisClient";
import { CustomError } from "../../../../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { emailSchema } from "../../../../validators/email";

const tenMinutes = 600;

export async function POST(req) {
  try {
    const body = await req.json();
    const { code, email } = z
      .object({ email: emailSchema, code: otpCodeSchema })
      .parse(body);
    
    const resp = await redis.get(email);
    
    if (!resp)
      throw new CustomError(
        "Invalid code",
        StatusCodes.FORBIDDEN,
        "Code expired or not generated for requested email",
      );

    const formatedValue = JSON.parse(resp);
    
    if (code !== formatedValue.otpCode)
      throw new CustomError(
        "Verification failed",
        StatusCodes.UNAUTHORIZED,
        "Submitted code is wrong",
      );
    // set email entry with confirmed flag set to true and reset ttl to 10 minutes
    await redis.set(
      email,
      JSON.stringify({ ...formatedValue, confirmed: true }),
      /* { expiration: { type: "EX", value: tenMinutes } }, */
    );

    return Response.json(
      {
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    return errorHandler(err);
  }
}
