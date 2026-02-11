import { Employee } from "../../../../models";
import { employeeDataSchema as EmployeeSchema } from "../../../../validators/employee";
import errorHandler from "../../../../utils/errorHandler";
import { authenticateRequest } from "../../../../decorators/authenticateRequest";

export const POST = authenticateRequest(routeHandler);

async function routeHandler(req) {
  try {
    const data = await req.json();
    const {
      firstName: first_name,
      lastName: last_name,
      birthDate: date_of_birth,
      parentName: parent_first_name,
    } = data || {};
    const employeeData = EmployeeSchema.parse({
      first_name,
      last_name,
      parent_first_name,
      date_of_birth,
    });

    await Employee.create({
      first_name: employeeData.first_name,
      last_name: employeeData.last_name,
      date_of_birth: employeeData.date_of_birth,
      parent_first_name: employeeData.parent_first_name,
    });
    return Response.json({
      success: true,
      data: "employee created",
      error: null,
    });
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}
