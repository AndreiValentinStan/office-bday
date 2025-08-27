// /api/auth/sign-in
// required(body): email, password

import { StatusCodes } from "http-status-codes";
import User from "../../../../models/user";
import { compare } from "bcryptjs";
import { CustomError } from "../../../../utils/CustomError";
import Sessions from "../../../../models/session";
import { createHash, createHmac, randomBytes } from "crypto";
import RefreshTokens from "../../../../models/refreshTokens";
import moment from "moment";
import jwt from "jsonwebtoken";
import { BaseError, EmptyResultError } from "sequelize";

export async function POST(request) {
  try {
    // parse request body
    const body = await request.json();

    // check required fields
    const { email, password } = body || {};

    if (!email || !password)
      throw new CustomError(
        "Please provide all required values",
        StatusCodes.BAD_REQUEST,
        "Missing email or password"
      );

    // look for user in db
    const user = await User.findAll({
      attributes: [
        ["password", "dbPasswdHash"],
        ["id", "userId"],
      ],
      where: {
        email: email,
      },
      rejectOnEmpty: true,
    });

    // check response array length: if it`s diff from one, we have big problems
    if (user && user?.length !== 1)
      throw new CustomError(
        "We`ve got some serious issues!",
        StatusCodes.INTERNAL_SERVER_ERROR
      );

    // destructure values from model instance
    const { dbPasswdHash, userId } =
      JSON.parse(JSON.stringify(user.pop())) || {};

    // check if required values from user exists
    if (!dbPasswdHash || !userId)
      throw new CustomError(
        "Can`t find required values. Quitting",
        StatusCodes.INTERNAL_SERVER_ERROR
      );

    // compare password
    const compareStatus = await compare(password, dbPasswdHash);
    if (!compareStatus)
      throw new CustomError("Bad credentials", StatusCodes.UNAUTHORIZED);

    // create session and store it to db
    const session = await Sessions.create(
      {
        user_id: userId,
        status: "active",
        changing_status_time: new Date(Date.now()),
        changing_status_reason: "successfull login",
      },
      { fields: ["user_id", "changing_status_time", "changing_status_reason"] }
    );

    // create refresh token
    const refreshToken = randomBytes(256).toString("hex");
    // generate refresh token hash
    const hash = createHash("sha512");
    hash.update(refreshToken);
    const refreshTokenHash = hash.digest("hex");

    // store refresh token hash in DB
    await RefreshTokens.create({
      session_id: session.getDataValue("id"),
      token_hash: refreshTokenHash,
    });

    // generate hmac
    const hmac = createHmac("sha512", process.env.HMAC_SECRET);
    hmac.update(refreshToken);
    const hmacRefreshToken = hmac.digest("hex") + "." + refreshToken;

    // STORE HMAC IN A COOKIE
    const afterTwoHours =
      moment().add(7, "d").format("ddd, DD MMM YYYY HH:mm:ss").toString() +
      " GMT";
    const cookieHeader = new Headers();
    cookieHeader.set(
      "Set-Cookie",
      `refreshToken=${hmacRefreshToken};path=/;httpOnly;SameSite=Strict;expires=${afterTwoHours}`
    );

    // create jwt acces token
    const accessToken = await new Promise((resolve, reject) => {
      jwt.sign(
        {
          role: "regular",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "5m",
          subject: userId,
        },
        (err, token) => {
          if (err) return reject(err);
          return resolve(token);
        }
      );
    });

    return Response.json(
      {
        accessToken,
        success: true,
      },
      {
        status: StatusCodes.OK,
        headers: cookieHeader,
      }
    );
  } catch (error) {
    console.log("some error ocured: ", error);
    if (error instanceof BaseError) {
      if (error instanceof EmptyResultError)
        error.message = "Cant find specified user";
    }
    return Response.json(
      {
        data: null,
        message: error.message,
      },
      {
        status: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
