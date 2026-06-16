import { col, fn, Op, where } from "sequelize";
import moment from "moment";
import { emailFormatter } from "../../../utils/emailFormatter";
import { Employee, Notification, User } from "@/models";
import errorHandler from "@/utils/errorHandler";
import { CustomError } from "@/utils/CustomError";
import { StatusCodes } from "http-status-codes";
import { holidays } from "@/utils/holidays2026";
import { sequelize } from "@/db/connectionDB";
import { sendEmail } from "@/utils/mailSender";

const { body, subject } = emailFormatter;

export async function GET() {
  try {
    // get date of latest send notification
    const { last_sended } = await Notification.findByPk(1, {
      attributes: ["last_sended"],
      rejectOnEmpty: true,
    });

    // check if a notification email was already sended (to skip send email on server restart)
    if (moment().diff(moment(last_sended), "days") === 0) {
      console.log(
        "A notification mail was already sended today: ",
        moment().toLocaleString(),
      );
      throw new CustomError(
        "Notification email already sended",
        StatusCodes.BAD_REQUEST,
      );
    }

    let celebrationsDates = [];
    let currentDate = moment('2026-17-07', 'YYYY-DD-MM');
    let skipReason = "";
    let isTodayDate = true;


    while (true) {
      // get current workday (skip on 6 or 7 - weekend)
      const currentWeekday = moment(currentDate).isoWeekday();
      let holidayName;
      const holidayToday = holidays.find((holiday) => {
        if (holiday.date === moment().format("YYYY-MM-DD")) {
          holidayName = holiday.localName;
          return true;
        }
        return false;
      });

      // check if weekend or holiday
      if (isTodayDate) {
        if (currentWeekday > 5) {
          skipReason = "weekends";
          break;
        }
        if (holidayToday) {
          skipReason = `holidays: ${holidayName}`;
          break;
        }
      } else {
        if (currentWeekday <= 5 || holidayToday) break;
      }

      celebrationsDates.push(currentDate.toISOString(true));
      // check if birthday people exists in tehe next days
      currentDate.add(1, "day");
      if (isTodayDate) isTodayDate = false;
    }
   
    // if celebrationsDates array is empty it must be weekend or holiday
    // if its len is grater than 1, current date is the day before weekend|holiday
    if (celebrationsDates.length < 1)
      throw new CustomError(
        "Skip sending email on " + skipReason,
        StatusCodes.EXPECTATION_FAILED,
      );

    // extract employees with birthdates in celebrationsDates array
    const celebratedEmployees = await Employee.findAll({
      attributes: [
        "first_name",
        "last_name",
        "date_of_birth",
        [
          fn("date_format", col("date_of_birth"), "%M %d"),
          "formated_birth_date",
        ],
      ],
      where: where(
        where(fn("date_format", col("date_of_birth"), "%m%d"), {
          [Op.gte]: moment(celebrationsDates[0]).format("MMDD"),
        }),
        Op.and,
        where(fn("date_format", col("date_of_birth"), "%m%d"), {
          [Op.lte]: moment(
            celebrationsDates[celebrationsDates.length - 1],
          ).format("MMDD"),
        }),
      ),
      order: [["date_of_birth"]],
    });
    if (celebratedEmployees.length < 1)
      throw new CustomError("Skip sending email: no celebrations today!");

    // extract active users as email destinations
    const users = await User.findAll({
      attributes: ["email"],
      where: {
        status: "ACTIVE",
      },
    });
    if (users.length < 1)
      throw new CustomError("Skip sending email: no destinations found");

    // send email
    const emailBody = body(celebratedEmployees);
    const emailSubject = subject();

    /* sendEmail({
      to: users,
      subject: emailSubject,
      body: emailBody,
    });
 */

    //update the date of last sended email
    await Notification.update(
      {
        last_sended: moment(),
      },
      {
        where: {
          id: 1,
        },
      },
    );

    return Response.json({ celebratedEmployees, users, emailBody, emailSubject });
  } catch (err) {
    return errorHandler(err);
  }
}
