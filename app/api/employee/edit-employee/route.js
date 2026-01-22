import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../../../utils/CustomError";
import { updateEmployeeDataSchema as EmployeeSchema } from "../../../../utils/validationData";
import errorHandler from "../../../../utils/errorHandler";
import { Employee } from "../../../../models";
import { where } from "sequelize";

export async function PUT(req) {
  try {
    // extract data from body
    const {
      first_name,
      last_name,
      parent_first_name,
      date_of_birth,
      id,
    } = await req.json();

    // data validation
    const employeeData = EmployeeSchema.parse({
      id,
      first_name,
      last_name,
      parent_first_name,
      date_of_birth,
    });

    console.log(employeeData);

    // update employee data
    const dbResponse = await Employee.update(
      employeeData,
      {
        where: {
          id,
        },
      }
    );

    return Response.json({
      success: true,
      data: dbResponse,
      message: 'User updated'
    });
  } catch (err) {
    return errorHandler(err);
  }
}
