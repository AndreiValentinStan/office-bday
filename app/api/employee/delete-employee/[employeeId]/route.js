import z from "zod";
import errorHandler from "../../../../../utils/errorHandler";
import { Employee } from "../../../../../models";
import { authenticateRequest } from "../../../../../decorators/authenticateRequest";

const bodySchema = z.object({
  employeeId: z.uuidv4(),
});

export const DELETE = authenticateRequest(routeHandler);

async function routeHandler(_req, { params }) {
  try {
    const { employeeId } = await bodySchema.parseAsync(await params);

    await Employee.destroy({
      where: {
        id: employeeId,
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
