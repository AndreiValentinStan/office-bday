import z from "zod";
import errorHandler from "../../../../utils/errorHandler";
import User from "../../../../models/user";

const uuidArray = z
  .array(z.uuidv4({ message: "User ID must have UUIDv4 format" }), {
    message: "Array of user ids expected",
  })
  .min(1, { message: "Array of at least one user id is expected" });

export async function PATCH(req) {
  try {
    const { accounts } = (await req.json()) || {};
    const accountsIds = uuidArray.parse(accounts);

    const result = await User.update(
      {
        status: "ACTIVE",
      },
      {
        where: {
          id: accountsIds,
        },
      },
    );

    console.log({ result });

    return Response.json({
      success: true,
      data: {
        result,
      },
      error: null,
    });
  } catch (err) {
    return errorHandler(err);
  }
}
