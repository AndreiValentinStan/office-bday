import { Employee } from "../../../../models";
import { employeeDataSchema as EmployeeSchema } from "../../../../validators/employee";
import errorHandler from "../../../../utils/errorHandler";
import { authenticateRequest } from "../../../../decorators/authenticateRequest";

export const POST = authenticateRequest(routeHandler);

async function routeHandler(req) {
  try {
    const employeeData = await EmployeeSchema.transform(
      ({ firstName, lastName, birthDate, parentName }) => ({
        first_name: firstName,
        last_name: lastName,
        date_of_birth: birthDate,
        parent_first_name: parentName,
      }),
    ).parseAsync(await req.json());

    await Employee.create({...employeeData});
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
