// extract accessToken header from request
// and attaches data from token to req object as encapsulatedData

import { headers } from "next/headers";
import { CustomError } from "../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import errorHandler from "../utils/errorHandler";
import { env } from "@/utils/envManager";

export const authenticateRequest = (next) => {
  return async (...rest) => {
    try {
      const [req, ...restRequest] = rest;
      // extract authorization header
      const authorization = (await headers()).get("authorization");
      if (!authorization || !authorization.startsWith("Bearer="))
        throw new CustomError(
          "Authorization error",
          StatusCodes.UNAUTHORIZED,
          "Authorization header missing or is malformed",
        );
      const JWT_SECRET = env.JWT_SECRET;
      const decodedData = await new Promise((resolve, reject) => {
        verify(authorization.split("=")[1], JWT_SECRET, (err, decoded) => {
          if (err)
            return reject(
              new CustomError(
                "Access token error",
                StatusCodes.UNAUTHORIZED,
                err.message,
              ),
            );
          resolve(decoded);
        });
      });

      // attach encapsulatedData to originalr equest object
      req.encapsulatedData = decodedData;

      return next(req, ...restRequest);
    } catch (e) {
      return errorHandler(e);
    }
  };
};
