import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../../../utils/CustomError";
import { Employee } from "../../../../models";
import moment from "moment";

export async function POST(req) {
  try {
    const data = await req.json();
    const { firstName, lastName, birthDate, parentName } = data || {};
    if (!firstName || !lastName || !birthDate)
      throw new CustomError(
        "Please provide all required fields",
        StatusCodes.BAD_REQUEST,
        "Missing first name, last name or birth date of the employee"
      );

    // check if provided date is valid
    if (!moment(birthDate, "DD-MM-YYYY", true).isValid())
      throw new CustomError(
        "Invalid date provided",
        StatusCodes.BAD_REQUEST,
        "Provided date must have DD/MM/YYYY format!"
      );

    // check if date is not "older" than 100 year or from the future
    if (
      !moment()
        .subtract(100, "years")
        .isBefore(moment(birthDate, "DD-MM-YYYY")) ||
      moment(birthDate, "DD-MM-YYYY").isAfter(moment())
    )
      throw new CustomError(
        "Wrong date",
        StatusCodes.BAD_REQUEST,
        "Provided date can`t be older than 100 years or from the future"
      );
    const formatedBirthDate = moment.utc(birthDate, "DD-MM-YYYY").toDate();

    await Employee.create({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: formatedBirthDate,
      parent_first_name: parentName,
    });
    return Response.json({
      success: true,
      data: "employee created",
      error: null,
    });
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        success: false,
        data: null,
        error: {
          message: err?.message || "generic error",
          reason: err?.reason || "generic reason",
        },
      },
      {
        status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
