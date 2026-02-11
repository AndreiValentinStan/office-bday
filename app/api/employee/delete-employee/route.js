import z from "zod";
import errorHandler from "../../../../utils/errorHandler";
import { Employee } from "../../../../models";
import { authenticateRequest } from "../../../../decorators/authenticateRequest";

const bodySchema = z.object({
  id: z.uuidv4(),
});

export const DELETE = authenticateRequest(routeHandler);

async function routeHandler(req) {
  try {
    const employeeData = (await req.json()) || {};
    const { id } = bodySchema.parse(employeeData);
    await Employee.destroy({
      where: {
        id,
      },
    });
    return Response.json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (err) {
    return errorHandler(err);
  }
}
