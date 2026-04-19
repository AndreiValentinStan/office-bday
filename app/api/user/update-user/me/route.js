import z from "zod";
import { authenticateRequest } from "../../../../../decorators/authenticateRequest";
import { firstNameSchema } from "../../../../../validators/firstName";
import { lastNameSchema } from "../../../../../validators/lastName";
import { passwordSchema } from "../../../../../validators/passwordSchema";
import { phoneSchema } from "../../../../../validators/phone";
import { CustomError } from "../../../../../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import errorHandler from "../../../../../utils/errorHandler";
import User from "../../../../../models/user";
import { compare } from "bcryptjs";

const validator = z
  .strictObject({
    firstName: firstNameSchema.optional(),
    lastName: lastNameSchema.optional(),
    phone: phoneSchema.optional(),
    actualPassword: passwordSchema.optional(),
    newPassword: passwordSchema.optional(),
  })
  .refine(
    ({ actualPassword, newPassword }) => {
      if (actualPassword || newPassword) if (!newPassword || !actualPassword) return false;
      return true;
    },
    {
      message: "Must provide old password and new password ",
    },
  )
  .transform(({ firstName, lastName, phone, actualPassword, newPassword }) => ({
    first_name: firstName,
    last_name: lastName,
    phone,
    password: actualPassword,
    newPassword,
  }));

const handler = async (req) => {
  try {
    // extract body
    const body = await req.json();

    // validate body values
    const validatedBody = validator.parse(body);

    // extract userId from req
    const { sub: userId } = req.encapsulatedData;

    // check if password exists, hash it -> compare with DB version -> check if newPasswordExists -> hash it -> save to DB
    if (validatedBody.password) {
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (!(await compare(validatedBody.password, user.password)))
        throw new CustomError(
          "Password missmatch",
          StatusCodes.FORBIDDEN,
          "Provided password is different from actual password",
        );

      validatedBody.password = validatedBody.newPassword;
      delete validatedBody.newPassword;
    }

    // update user data in DB and return new value of user
    await User.update(
      {
        ...validatedBody,
      },
      {
        where: {
          id: userId,
        },
      },
    );

    const updatedUser = await User.findOne({
      where: {
        id: userId
      },
      attributes: [
        ['first_name', 'firstName'],
        ['last_name', 'lastName'],
        'email',
        'phone'
      ]
    })

    return Response.json({
      success: true,
      data: {
        user: updatedUser,
      },
      error: null,
    });
  } catch (err) {
    return errorHandler(err);
  }
};

export const PATCH = authenticateRequest(handler);
