import { col, fn, Op, where } from "sequelize";
import { authenticateRequest } from "../../../decorators/authenticateRequest";
import { Employee } from "../../../models";
import moment from "moment";
import { emailFormatter } from "../../../utils/emailFormatter";

const {body, subject} = emailFormatter;

/* export const GET = authenticateRequest(employeesBirthdayNotify);

const employeesBirthdayNotify = async (req) => {
  const celebratingToday = await Employee.findAndCountAll({
    where: {
      [Op.like]: where(fn("date_format", col("date_of_birth"))),
    },
  });
  console.log(celebratingToday);
}; */

export async function GET() {
  const today =  moment().format("MMDD").toString();
  const lastDay = moment().add(10, 'days').format('MMDD').toString();

  const dailyCelebrations = await Employee.findAll({
    attributes: ["first_name", "last_name"],
    where: where(fn("date_format", col("date_of_birth"), "%m%d"), {
      [Op.eq]: today,
    }),
  });

  const monthyCelebrations = await Employee.findAll({
    attributes: ["first_name", "last_name", "date_of_birth"],
    where: where(
      where(fn("date_format", col("date_of_birth"), "%m%d"), {
        [Op.gt]: today,
      }),
      Op.and,
      where(fn("date_format", col("date_of_birth"), "%m%d"), {
        [Op.lt]: lastDay,
      }),
    ),
    order: [["date_of_birth"]],
  });

  const emailBody = body(dailyCelebrations, monthyCelebrations);
  const emailSubject = subject();

  console.log(emailSubject)
  console.log(emailBody);


  return Response.json({
    success: true,
    data: {
      daily: dailyCelebrations,
      monthly: monthyCelebrations,
    },
    error: null,
  });
}
