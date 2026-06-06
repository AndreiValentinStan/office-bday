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

    // check if code exist for provided email
    if (!resp)
      throw new CustomError(
        "Code does not exist for provided email",
        StatusCodes.FORBIDDEN,
        "Invalid OTP code",
      );

    const formatedValue = JSON.parse(resp);

    // check if provided code is correct
    if (code !== formatedValue.otpCode)
      throw new CustomError(
        "Submitted code is wrong",
        StatusCodes.UNAUTHORIZED,
        "Invalid OTP code",
      );

    // check if provided code is not expired
    if (Math.floor(Date.now() / 1000) > formatedValue.date + tenMinutes)
      throw new CustomError(
        "Submitted code is expired",
        StatusCodes.UNAUTHORIZED,
        "Invalid OTP code",
      );

    // validate code and update entry in DB
    redis.set(email, JSON.stringify({...formatedValue, confirmed: true}))

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
