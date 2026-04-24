import { randomInt } from "crypto";
import { redis } from "../../../../db/redisClient";
import { emailSchema } from "../../../../validators/register";
import errorHandler from "../../../../utils/errorHandler";
import User from "../../../../models/user";
import { CustomError } from "../../../../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import z from "zod";

export async function POST(req) {
  try {
    const { email } = z.object({ email: emailSchema }).parse(await req.json());

    // check if an account with provided email already exists
    const userExists = await User.findOne({
      where: {
        email,
      },
    });
    if (userExists)
      throw new CustomError(
        "An account with provided email already exists",
        StatusCodes.FORBIDDEN,
      );

    // gen OTP
    let otpCode = "";
    while (true) {
      otpCode += randomInt(0, 9).toString();
      if (otpCode.length >= 6) break;
    }
    const res = await redis.set(
      email,
      JSON.stringify({
        otpCode,
        date: Math.floor(Date.now() / 1000),
        confirmed: false,
      }),
      {
        expiration: {
          type: "EX",
          value: 24 * 3600,
        },
      },
    );

    return Response.json(
      {
        success: true,
        data: { message: "OTP code generated succesfully" },
        error: null,
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    return errorHandler(err);
  }
}
