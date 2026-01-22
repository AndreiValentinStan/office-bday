import z from "zod";
import errorHandler from "../../../../utils/errorHandler";
import { Employee } from "../../../../models";

const bodySchema = z.object({
  id: z.string().uuid({ version: "v4" }),
});

export async function DELETE(req) {
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
