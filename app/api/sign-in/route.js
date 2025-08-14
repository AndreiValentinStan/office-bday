import StatusCodes from "http-status-codes";
import {randomBytes} from 'node:crypto';

export async function POST(req) {
  const body = await req.json();
  let response = new Response();
  if (!body) {
    console.log("Error in parsing body");
    return Response.json({}, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }

  // extract email and password
  const { email, password } = body;
  if (!email || !password) {
    console.log("User didn't provide all required values");
    return Response.json({}, { status: StatusCodes.BAD_REQUEST });
  }

  // search user in DB

  // create session
  //const sessionId = null;

  // create x-CSRF Token and attach to coresponding cookie
  const csrfToken = randomBytes(128);
  await response.headers({'Set-Cookie': `x-CSRF=${csrfToken}`});

  

  return Response.json(
    {
      message: "test ok",
    },
    { status: 255, statusText: "okeiut" }
  );
}
