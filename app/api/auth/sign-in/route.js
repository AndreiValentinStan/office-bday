export const runtime = "nodejs";

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
import { loginDataSchema } from "../../../../validators/login";
import errorHandler from "../../../../utils/errorHandler";
import {env} from '../../../../utils/envManager';

export async function POST(request) {
  try {
    // parse request body
    const body = await request.json();

    // data validation
    let { email, password } = loginDataSchema.parse(body);

    // look for user in db
    const user = await User.findAll({
      attributes: [
        ["password", "dbPasswdHash"],
        ["id", "userId"],
        ["first_name", "firstName"],
        ["last_name", "lastName"],
        "phone",
        "status",
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
        StatusCodes.INTERNAL_SERVER_ERROR,
      );

    // destructure values from model instance
    const { dbPasswdHash, userId, firstName, lastName, phone, status } =
      JSON.parse(JSON.stringify(user.pop())) || {};

    // check if required values from user exists
    if (!dbPasswdHash || !userId)
      throw new CustomError(
        "Can`t find required values. Quitting",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );

    // compare password
    const compareStatus = await compare(password, dbPasswdHash);
    if (!compareStatus)
      throw new CustomError("Bad credentials", StatusCodes.UNAUTHORIZED);

    // check if account is active
    if (status !== "ACTIVE") {
      let errorMessage = "";
      switch (status) {
        case "PENDING":
          errorMessage = "Your account is not activated";
          break;
        case "REVOKED":
          errorMessage = "Your account is not blocked";
          break;
        default:
          errorMessage = "Your account have some issues";
      }
      throw new CustomError(errorMessage, StatusCodes.FORBIDDEN);
    }

    // create session and store it to db
    const session = await Sessions.create(
      {
        user_id: userId,
        status: "active",
        changing_status_time: new Date(Date.now()),
        changing_status_reason: "successfull login",
      },
      { fields: ["user_id", "changing_status_time", "changing_status_reason"] },
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
    const HMAC_SECRET = env.HMAC_SECRET;
    const hmac = createHmac("sha512", HMAC_SECRET);
    hmac.update(refreshToken);
    const hmacRefreshToken = hmac.digest("hex") + "." + refreshToken;

    // STORE HMAC IN A COOKIE
    const afterTwoHours =
      moment()
        .add(100, "seconds")
        .format("ddd, DD MMM YYYY HH:mm:ss")
        .toString() /* + " GMT" */;
    const cookieHeader = new Headers();
    cookieHeader.set(
      "Set-Cookie",
      `refreshToken=${hmacRefreshToken};path=/api/auth/;httpOnly;SameSite=Strict;max-age=7200`,
    );

    // create jwt acces token
    const JWT_SECRET = env.JWT_SECRET;
    const accessToken = await new Promise((resolve, reject) => {
      jwt.sign(
        {
          role: "regular",
        },
        JWT_SECRET,
        {
          expiresIn: "15s",
          subject: userId,
        },
        (err, token) => {
          if (err) return reject(err);
          return resolve(token);
        },
      );
    });

    return Response.json(
      {
        success: true,
        error: null,
        data: {
          accessToken,
          email,
          firstName,
          lastName,
          phone,
          session: session.getDataValue('id')
        },
      },
      {
        status: StatusCodes.OK,
        headers: cookieHeader,
      },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
