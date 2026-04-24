// /api/auth/register
import { StatusCodes } from "http-status-codes";
import User from "../../../../models/user";
import { registerDataSchema } from "../../../../validators/register";
import errorHandler from "../../../../utils/errorHandler";
import { redis } from "../../../../db/redisClient";
import { CustomError } from "../../../../utils/CustomError";

export async function POST(req) {
  try {
    console.log(req);
    const body = await req.json();

    // validate recieved data
    const { firstName, lastName, email, password, phone } =
      registerDataSchema.parse(body);

    // check if otp code is validated
    const emailOtpCode = await redis.get(email);
    if (!emailOtpCode) {
      throw new CustomError(
        "OTP entry missing for current user",
        StatusCodes.UNAUTHORIZED,
      );
    }
    const { confirmed = false } = JSON.parse(emailOtpCode);
    if (!confirmed)
      throw new CustomError(
        "OTP code was not confirmed",
        StatusCodes.FORBIDDEN,
      );

    // check if account is already registred
    const userExist = await User.findOne({
      where: { email },
    });

    if (userExist)
      throw new CustomError(
        "An acount with provided email already exists",
        StatusCodes.FORBIDDEN,
      );

    // create entry in DB
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone: phone || "",
    });

    return Response.json(
      {
        success: true,
        data: {
          userId: user.getDataValue("id"),
        },
        error: null,
      },
      {
        status: StatusCodes.CREATED,
      },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
