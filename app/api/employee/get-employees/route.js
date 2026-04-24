import Employee from "../../../../models/employees";
import { Op } from "sequelize";
import moment from "moment";
import errorHandler from "../../../../utils/errorHandler";
import getEmployeesSchema from "../../../../validators/getEmployees";
import { authenticateRequest } from "../../../../decorators/authenticateRequest";

export const GET = authenticateRequest(handler);

async function handler(req) {
  try {
    const params = req.nextUrl.searchParams;

    const searchParams = Object.fromEntries(params.entries());

    const { first_name, last_name, age, page, count } =
      await getEmployeesSchema.parseAsync(searchParams);
    const pagination = {};
    if (!page) pagination.limit = 0;

    pagination.limit = !count ? 20 : count;
    pagination.offset = !page ? 0 : (page - 1) * count;

    // default ordering
    const order = ['last_name', 'ASC']

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
      },
      order: [order]
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
