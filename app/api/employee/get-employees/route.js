import Employee from "../../../../models/employees";
import { col, fn, Op, where } from "sequelize";
import moment from "moment";
import errorHandler from "../../../../utils/errorHandler";
import getEmployeesSchema from "../../../../validators/getEmployees";
import { authenticateRequest } from "../../../../decorators/authenticateRequest";

export const GET = authenticateRequest(handler);

async function handler(req) {
  try {
    const params = req.nextUrl.searchParams;

    const searchParams = Object.fromEntries(params.entries());

    const { first_name, last_name, age, page, count, day, month, year } =
      await getEmployeesSchema.parseAsync(searchParams);

    const pagination = {};
    if (!page) pagination.limit = 0;

    pagination.limit = !count ? 20 : count;
    pagination.offset = !page ? 0 : (page - 1) * count;

    // default ordering
    const order = ["last_name", "ASC"];

    // birth date formatting
    let birthDate = "";
    let format = "";
    if (day) {
      birthDate += day;
      format += "%e";
    }
    if (month) {
      if (month < 10) birthDate += "0";
      birthDate += month;
      format += "%m";
    }
    if (year) {
      birthDate += year;
      format += "%Y";
    }

    const { count: employeesCount, rows } = await Employee.findAndCountAll({
      ...pagination,
      where: {
        ...(first_name && {
          first_name: {
            [Op.like]: `%${first_name}%`,
          },
        }),
        ...(last_name && {
          last_name: {
            [Op.like]: `%${last_name}%`,
          },
        }),
        ...(birthDate && {
          where: where(
            fn("date_format", col("date_of_birth"), format),
            birthDate,
          ),
        }),
      },
      order: [order],
    });

    let employeesAges = [];
    if (age) {
      employeesAges = rows.filter(
        (employee) => moment().diff(employee["date_of_birth"], "years") === age,
      );
    }

    return Response.json({
      success: true,
      data: {
        employees: {
          count: employeesCount,
          employees: age ? employeesAges : rows,
        },
      },
    });
  } catch (err) {
    return errorHandler(err);
  }
}
