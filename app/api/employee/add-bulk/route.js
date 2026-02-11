import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../../../utils/CustomError";
import z, { ZodError } from "zod";
import Employee from "../../../../models/employees";
import moment from "moment";
import { authenticateRequest } from "../../../../decorators/authenticateRequest";

// define validation schema
const employeeSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(100, "First name must be maximum 100 characters long")
    .regex(/^[a-zA-Z]+$/, "First name must contain only letters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(100, "Last name must be maximum 100 characters long")
    .regex(/^[a-zA-Z]+$/, "Last name must contain only letters"),
  parent_first_name: z
    .preprocess(
      (val) => {
        return !val ? undefined : val;
      },
      z
        .string()
        .min(2, "Parent name must be at least 2 characters long")
        .max(100, "Parent name must be maximum 100 characters long")
        .regex(
          /^(?!(?:.* ){5,})[a-zA-Z ]+$/,
          "Parent name must contain only letters and maximum two spaces"
        )
        .optional()
    )
    .transform((name) => (!name ? null : name)),
  date_of_birth: z
    .string()
    .regex(
      /[0-9]{2}-[0-9]{2}-[0-9]{4}/,
      "Birth date must have dd-mm-yyyy format"
    )
    .transform((birthDate) => moment.utc(birthDate, "DD-MM-YYYY").toDate()),
});

export const POST = authenticateRequest(routeHandler)

async function routeHandler(req) {
  try {
    // check if request type if multipart/form-data
    if (
      !req?.headers?.get("content-type") ||
      !req?.headers?.get("content-type")?.startsWith("multipart/form-data;")
    )
      throw new CustomError(
        "Missing or wrong content-type value",
        StatusCodes.BAD_REQUEST
      );

    // extract request body as formData
    const body = await req.formData();

    // extract expected file
    const file = await body.get("employeesFile");
    if (!file)
      throw new CustomError(
        "Can`t parse uploaded file",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Possibly wrong format"
      );

    // limit file size
    // TODO

    // extract content from file
    const data = await file.text();

    // get data as an array
    const dataRows = data.trim().split("\n");

    if (dataRows.length <= 1)
      throw new CustomError(
        "Empty file",
        StatusCodes.BAD_REQUEST,
        "Uploaded file has no relevant data"
      );

    // check if csv file headers are in requested order
    const standardHeaders = [
      "first_name",
      "last_name",
      "parent_first_name",
      "date_of_birth",
    ];
    const csvHeader = dataRows[0].split(";");
    for (const [index, val] of standardHeaders.entries()) {
      if (csvHeader[index] !== val)
        throw new CustomError(
          "Wrong format of uploaded file",
          StatusCodes.BAD_REQUEST,
          "CSV file must have headers in this specific order: first_name, last_name, parent_name, date_of_birth"
        );
    }

    // parse csv rows and convert result into an array of employees obj
    dataRows.splice(0, 1); // remove headers row
    let employees = dataRows.map((row) => {
      let employee = {};
      const employeeData = row.split(";");
      for (const [index, propName] of standardHeaders.entries()) {
        employee[propName] = employeeData[index];
      }
      return employee;
    });

    // sanitaze employee data
    const employeeArraySchema = z.array(employeeSchema);
    employees = employeeArraySchema.parse(employees);

    // insert data to DB
    await Employee.bulkCreate(employees, {
      validate: true,
      updateOnDuplicate: ["updatedAt"],
    });

    return Response.json({
      success: true,
      data: 'ok',
    });
  } catch (err) {
    console.log("Ups, some error ocurred: ", err.errors);
    const errObj = {
      message: err.message,
      reason: "No adititonal data",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };

    if (err instanceof CustomError) {
      errObj.message = err?.message || "Generic error";
      errObj.reason = err?.reason || "No aditional data";
      errObj.statusCode = err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    }
    if (err instanceof ZodError) {
      errObj.message = err?.issues?.map(
        (error) => error.message + " --> " + error.path
      );
      errObj.reason = err?.reason || "No aditional data";
      errObj.statusCode = StatusCodes.BAD_REQUEST;
    }
    return Response.json(
      {
        success: false,
        error: {
          message: errObj.message,
          data: errObj.reason,
        },
      },
      { status: errObj.statusCode }
    );
  }
}
