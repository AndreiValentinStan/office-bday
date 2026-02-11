// extract accessToken header from request
// and attaches data from token to req object as encapsulatedData

import { headers } from "next/headers";
import { CustomError } from "../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import errorHandler from "../utils/errorHandler";
import { NextRequest } from "next/server";

export const authenticateRequest = (next) => {
  return async (req) => {
    try {
      // extract authorization header
      const authorization = (await headers()).get("authorization");
      if (!authorization || !authorization.startsWith("Bearer="))
        throw new CustomError(
          "Authorization error",
          StatusCodes.UNAUTHORIZED,
          "Authorization header missing or is malformed",
        );
      const decodedData = await new Promise((resolve, reject) => {
        verify(
          authorization.split("=")[1],
          process.env.JWT_SECRET,
          (err, decoded) => {
            if (err)
              return reject(
                new CustomError(
                  "Access token error",
                  StatusCodes.UNAUTHORIZED,
                  err.message,
                ),
              );
            resolve(decoded);
          },
        );
      });

      // attach encapsulatedData to originalr equest object
      NextRequest.prototype.encpasulatedData = decodedData;
      //Request.prototype.encpasulatedData = decodedData;
      const newRequest = new NextRequest(req); 
      return next(newRequest);
    } catch (e) {
      return errorHandler(e);
    }
  };
};
