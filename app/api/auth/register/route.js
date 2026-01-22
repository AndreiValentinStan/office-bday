// /api/auth/register
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../../../utils/CustomError";
import User from "../../../../models/user";
import { registerDataSchema } from "../../../../validators/register";
import errorHandler from "../../../../utils/errorHandler";

export async function POST(req) {
  try {
    const { firstName, lastName, email, password, retypedPassword, phone } =
      await req.json();

    // validate recieved data
    registerDataSchema.parse({
      firstName,
      lastName,
      email,
      phone,
      password,
      retypedPassword,
    });

    // intentional sleeper
    await new Promise((res, rej) => {
      setTimeout(() => {
        return res();
      }, 3000);
    });

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
  } catch (error){
    return errorHandler(error)
  }
}
