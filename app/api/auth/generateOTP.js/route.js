import { randomInt } from "crypto";
import { redis } from "../../../../db/redisClient";
import { emailSchema } from "../../../../validators/register";
import errorHandler from "../../../../utils/errorHandler";

export async function POST(req) {
  try {
    const { email } = await req.json();

    console.log(email);

    // validate email
    emailSchema.parse(email);

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
        date: Date.now(),
        confirmed: false,
      }),
      {
        expiration: {
          type: "EX",
          value: 24  * 3600,
        },
      },
    );

    console.log({ res, otpCode });

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
