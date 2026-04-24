import { updateEmployeeDataSchema as EmployeeSchema } from "../../../../validators/employee";
import errorHandler from "../../../../utils/errorHandler";
import { Employee } from "../../../../models";
import { authenticateRequest } from "../../../../decorators/authenticateRequest";

export const PATCH = authenticateRequest(routeHandler);

async function routeHandler(req) {
  try {
    // data validation
    let employeeData = await EmployeeSchema.transform(
      ({ firstName, lastName, birthDate, parentName, id }) => ({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: birthDate,
        parent_first_name: parentName,
        id
      }),
    ).parseAsync(await req.json());

    // check if parent first name is missing
    // set parentFirstName to null in DB

    if (typeof employeeData.parent_first_name === "undefined")
      employeeData.parent_first_name = null;

    // update employee data
    const dbResponse = await Employee.update({...employeeData}, {
      where: {
        id: employeeData.id,
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
