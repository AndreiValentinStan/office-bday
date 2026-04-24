import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../../../utils/CustomError";
import errorHandler from "../../../../utils/errorHandler";
import { createHash, createHmac, randomBytes } from "node:crypto";
import RefreshTokens from "../../../../models/refreshTokens";
import Sessions from "../../../../models/session";
import moment from "moment";
import jwt from "jsonwebtoken";
import User from "../../../../models/user";
import { sequelize } from "../../../../db/connectionDB";
import { Sequelize } from "sequelize";

export async function POST(request) {
  try {
    // extract refresh token from cookie
    const { value } = request.cookies.get("refreshToken") || {};
    if (!value)
      throw new CustomError(
        "Couldn`t fetch data from refresh token cookie",
        StatusCodes.UNAUTHORIZED,
      );

    // parse refreshToken cookie value and signed value
    const [hash, token] = value.split(".");
    if (!hash || !token)
      throw new CustomError(
        "Can`t decode refresh token",
        StatusCodes.BAD_REQUEST,
      );

    // verify authenticity of refresh token: gen hash from token and compare with hash
    const hmac = createHmac("sha512", process.env.HMAC_SECRET);
    hmac.update(token);
    const tokenHash = hmac.digest("hex");

    // compare token and hashed value
    if (tokenHash !== hash)
      throw new CustomError(
        "Couldn`t authenticate refresh token",
        StatusCodes.UNAUTHORIZED,
      );

    // search in DB for hashed refresh token
    const hashCreator = createHash("sha512");
    hashCreator.update(token);
    const hashedToken = hashCreator.digest("hex");

    const result = await RefreshTokens.findAll({
      where: {
        token_hash: hashedToken,
      },
      include: Sessions,
    });

    // more than refresh_token corespond to search query => not good
    if (result?.length !== 1)
      throw new CustomError(
        "More than one refresh token with same value exists in DB",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );

    // check if refresh token is revoked
    // mark session as revoked, reason: trying to resend an already revoked refresh token => ALARM
    const refreshToken = result[0];

    if (refreshToken.getDataValue("revocation_time") !== null) {
      // set session as revoked
      Sessions.update(
        {
          changing_status_time: moment().toISOString(),
          changing_status_reason:
            "try to obtain a new access token using an expired refresh token",
          status: "REVOKED",
        },
        {
          where: {
            id: result[0].getDataValue("Session").id,
          },
        },
      );
      throw new CustomError(
        "Refresh token is already revoked",
        StatusCodes.FORBIDDEN,
      );
    }

    // check if refresh token is still valid
    // valid time 2h, 7dyas etc
    if (refreshToken.getDataValue("updatedAt")) {
      // TO BE creted
    }

    // check if session is still valid
    const session = result[0].getDataValue("Session");
    if (!session)
      throw new CustomError(
        "Can`t find a session associated with current refresh token",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );

    const isValidStatus = session.status;
    if (isValidStatus !== "active")
      // that means session is either expired or is revoked
      throw new CustomError(
        "Session expired. Please login",
        StatusCodes.FORBIDDEN,
      );
    
    // check if account is ACTIVE
    const user = await User.findByPk(session.user_id, {
      attributes: [
        "email",
        [
          sequelize.fn(
            "CONCAT_WS",
            " ",
            Sequelize.col("first_name"),
            Sequelize.col("last_name"),
          ),
          "full_name",
        ],
        ['first_name', 'firstName'],
        ['last_name', 'lastName'],
        'phone',
        'status'
      ],
    });
    if(status !== 'ACTIVE')
      throw new CustomError(`Your account is ${status}`, StatusCodes.FORBIDDEN, 'Can`t obtain new refresh token');

    const isValidTime = moment(session.createdAt).add(1, 'month') >= moment();
    // session expired
    if (!isValidTime) {
      // mark session as expired
      await Sessions.update(
        {
          status: "expired",
          changing_status_time: moment().toISOString(),
          changing_status_reason: "session reached life limit",
        },
        {
          where: {
            id: session.id,
          },
        },
      );

      // mark refresh token as revoked
      await RefreshTokens.update(
        {
          revocation_time: moment().toISOString(),
        },
        {
          where: {
            id: refreshToken.getDataValue("id"),
          },
        },
      );

      throw new CustomError(
        "Session expired",
        StatusCodes.FORBIDDEN,
        "current session expired; login required",
      );
    }

    // session is valid, we have to
    // 1) revoke recieved refreshToken
    await RefreshTokens.update(
      {
        revocation_time: moment().toISOString(),
      },
      {
        where: {
          id: refreshToken.getDataValue("id"),
        },
      },
    );

    // 2) generate new refresh token
    const newRefreshToken = randomBytes(256).toString("hex");
    const newHashCreator = createHash("sha512");
    newHashCreator.update(newRefreshToken);
    const hashedRefreshToken = newHashCreator.digest("hex");

    // 3) store hashed refreshToken in DB
    await RefreshTokens.create({
      session_id: session.id,
      token_hash: hashedRefreshToken,
    });

    // 4) update session accordingly
    await Sessions.update(
      {
        changing_status_time: moment().toISOString(),
        changing_status_reason: "new refresh token lease",
      },
      {
        where: {
          id: session.id,
        },
      },
    );

    // 5) create hmac of refreshToken
    const hmacRefreshTokenCreator = createHmac(
      "sha512",
      process.env.HMAC_SECRET,
    );
    hmacRefreshTokenCreator.update(newRefreshToken);
    const hmacRefreshToken =
      hmacRefreshTokenCreator.digest("hex") + "." + newRefreshToken;

    // 6) set refreshToken cookie
    const afterTwoHours =
      moment()
        .add(12, "seconds")
        .format("ddd, DD MMM YYYY HH:mm:ss")
        .toString() + " GMT";
    const cookieHeader = new Headers();
    cookieHeader.set(
      "Set-Cookie",
      `
       refreshToken=${hmacRefreshToken};path=/api/auth/;httpOnly;SameSite=Strict;expires=${afterTwoHours}`,
    );

    // 7) generate new accessToken
    const accessToken = await new Promise((resolve, reject) => {
      jwt.sign(
        {
          role: "regular",
        },
        process.env.JWT_SECRET,
        {
          subject: session.user_id,
          expiresIn: "5m",
        },
        (err, token) => {
          if (err) return reject("Couldn`t generate access token!");
          return resolve(token);
        },
      );
    });

    /* // 8) get user data to be provided to app
    const user = await User.findByPk(session.user_id, {
      attributes: [
        "email",
        [
          sequelize.fn(
            "CONCAT_WS",
            " ",
            Sequelize.col("first_name"),
            Sequelize.col("last_name"),
          ),
          "full_name",
        ],
        ['first_name', 'firstName'],
        ['last_name', 'lastName'],
        'phone'
      ],
    }); */

    return Response.json(
      {
        accessToken,
        user,
      },
      {
        status: StatusCodes.OK,
        headers: cookieHeader,
      },
    );
  } catch (err) {
    console.log("Ups, some error occured: \n", err);
    return errorHandler(err);
  }
}
