import { updateEmployeeDataSchema as EmployeeSchema } from "../../../../validators/employee";
import errorHandler from "../../../../utils/errorHandler";
import { Employee } from "../../../../models";
import { authenticateRequest } from "../../../../decorators/authenticateRequest";

export const PATCH = authenticateRequest(routeHandler);

async function routeHandler(req) {
  try {
    // extract data from body
    const { first_name, last_name, parent_first_name, date_of_birth, id } =
      await req.json();

    // data validation
    let employeeData = EmployeeSchema.parse({
      id,
      first_name,
      last_name,
      parent_first_name,
      date_of_birth,
    });

    // check if parent first name is missing
    // set parentFirstName to null in DB
   
    if (typeof employeeData.parent_first_name === "undefined")
      employeeData.parent_first_name = null;

    // update employee data
    const dbResponse = await Employee.update(employeeData, {
      where: {
        id,
      },
    });

    return Response.json({
      success: true,
      data: dbResponse,
      message: "User updated",
    });
  } catch (err) {
    return errorHandler(err);
  }
}
