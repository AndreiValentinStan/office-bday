import { StatusCodes } from "http-status-codes";
import { authenticateRequest } from "../../../../decorators/authenticateRequest";

import RefreshTokens from "../../../../models/refreshTokens";
import errorHandler from "../../../../utils/errorHandler";
import { uuidSchema } from "../../../../validators/uuidSchema";
import Sessions from "../../../../models/session";
import { headers } from "next/headers";
import moment from "moment/moment";

const logoutHandler = async (req) => {
  try {
    // extract user id
    const { sub: userId } = req.encapsulatedData;

    // extract body
    const { sessionId } = await req.json();

    // validate sessionId
    uuidSchema.parse(sessionId);

    // extract session data and associated refresh token
    const session = await Sessions.findOne({
      where: {
        id: sessionId,
      },
      include: RefreshTokens,
      rejectOnEmpty: true,
    });

    // revoke refresh token
    await RefreshTokens.update(
      {
        revocation_time: new Date(Date.now()),
      },
      {
        where: {
          session_id: session
            .getDataValue("RefreshTokens")[0]
            .getDataValue("session_id"),
        },
      },
    );

    // set session state to closed
    await Sessions.update(
      {
        status: "closed",
        changing_status_time: new Date(Date.now()),
        changing_status_reason: "User logged out successfully",
      },
      {
        where: {
          id: session.getDataValue("id"),
        },
      },
    );

    // clear refresh token cookie
    const now = new Date(Date.now() - 10000)
      /* moment().format("ddd, DD MMM YYYY HH:mm:ss").toString() */;
    const cookieHeader = new Headers();
    cookieHeader.set(
      "Set-Cookie",
      `refreshToken='';path=/api/auth/;httpOnly;SameSite=Strict;expires=${now}`,
    );

    // return
    return new Response(null, {
      status: StatusCodes.NO_CONTENT,
      headers: cookieHeader,
    });
  } catch (err) {
    return errorHandler(err);
  }
};

export const POST = authenticateRequest(logoutHandler);
