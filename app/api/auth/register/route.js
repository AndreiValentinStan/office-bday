// /api/auth/register
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../../../utils/CustomError";
import User from "../../../../models/user";

export async function POST(req) {
  try {
    const { firstName, lastName, email, password, rePassword, phone } =
      (await req.json()) || {};

    // assure body integrity
    if (!firstName || !lastName || !email || !password || !rePassword)
      throw new CustomError(
        "Please provide all required values",
        StatusCodes.BAD_REQUEST
      );

    await new Promise((res, rej) => {
      setTimeout(() => {
        return res();
      }, 3000);
    });

    // check if passwords match
    if (password !== rePassword)
      throw new CustomError("Passwords provided doesn`t match");

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
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        data: null,
        error: error?.messgage || "Error on creating new user",
      },
      {
        status: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
