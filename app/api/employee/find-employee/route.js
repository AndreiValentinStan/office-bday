import { z } from "zod";
import errorHandler from "../../../../utils/errorHandler";
import Employee from "../../../../models/employees";
import { authenticateRequest } from "../../../../decorators/authenticateRequest";

const paramSchema = z.object({
  employeeId: z.uuid({
    version: "v4",
    message: "Please provide an valid employeeId",
  }),
});

export const GET = authenticateRequest(routeHandler)

async function routeHandler(req) {
  try {
    const params = req.nextUrl.searchParams;
    const searchParams = Object.fromEntries(params.entries());

    paramSchema.parse(searchParams);

    const user = await Employee.findOne({
      where: {
        id: searchParams.employeeId,
      },
      attributes: [
        "first_name",
        "last_name",
        "parent_first_name",
        "date_of_birth",
      ],
    });

    return Response.json({
      success: true,
      data: user,
    });
  } catch (err) {
    return errorHandler(err);
  }
}
