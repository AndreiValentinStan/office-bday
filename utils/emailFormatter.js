import moment from "moment";
import { CustomError } from "./CustomError";

const emailSubject = `Aniversare`;

const body = (celebratedEmployees) => {
  // check if are celebrations beyond current day
  let totalCelebrationDays = [];
  for (let employee of celebratedEmployees) {
    if (!totalCelebrationDays.includes(employee.formated_birth_date))
      totalCelebrationDays.push(employee.formated_birth_date);
  }

  if (totalCelebrationDays.length < 1)
    throw new CustomError("Celebrated employees array is in wrong format");

  const currentDate = moment("2026-17-07", "YYYY-DD-MM").format("MMMM DD");
  console.log({ currentDate });

  let formatedCelebrations = {};

  for (let employee of celebratedEmployees) {
    let formatedBirthDate = employee.get().formated_birth_date;
    console.log({ formatedBirthDate });
    formatedCelebrations = {
      ...formatedCelebrations,
      [formatedBirthDate]: [
        ...(formatedCelebrations[formatedBirthDate] || ""),
        `${employee.first_name} ${employee.last_name}`,
      ],
    };
  }
  console.log(formatedCelebrations);
  let bodyMessage = `Am onoarea sa va salut, `;
  bodyMessage +=
    !formatedCelebrations[currentDate]?.length ||
    formatedCelebrations[currentDate]?.length < 1
      ? ""
      : `</br>  Sarbatoritii zilei de astazi ${moment(currentDate, "MMMM DD").format("DD MMM")} sunt${formatedCelebrations[currentDate].map((d, i, arr) => ` <b>${d}</b>`)}.<br/>`;

  if (
    Object.keys(formatedCelebrations).filter(
      (date) =>
        moment(date, "MMMM YYYY").diff(moment(currentDate, "MMMM YYYY")) > 1,
    ).length > 0
  )
    bodyMessage += `Pentru ca urmeaza o perioada in care nu veti fi la birou, sarabtoritii din perioada libera sunt:<br/>`;

  for (let date in formatedCelebrations) {
    if (date === currentDate) {
      continue;
    }
    bodyMessage += `<br/>- ${date}<ul>`;
    for (let empl of formatedCelebrations[date]) {
      bodyMessage += `<li>${empl}</li>`;
    }
    bodyMessage+= `</ul>`;
  }

  return bodyMessage;
};

const subject = () => {
  return emailSubject;
};

export const emailFormatter = {
  body,
  subject,
};
