import { accessTokenVerify } from "../../../../decorators/accessTokenVerify";
import errorHandler from "../../../../utils/errorHandler";

export const GET = accessTokenVerify((req) => {
  // check for encoded data
  try {
    const { encpasulatedData } = req;
    return Response.json({
      data: encpasulatedData,
    });
  } catch (e) {
    return errorHandler(e);
  }
});
