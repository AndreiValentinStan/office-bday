import { sendEmail } from "../../../../utils/mailSender";
import errorHandler from "../../../../utils/errorHandler";

export async function POST(req) {
  try {
    const body = await req.json();
    sendEmail(body);

    return Response.json({
      OK: true,
    });
  } catch (err) {
    return errorHandler(err);
  }
}
