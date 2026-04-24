import moment from "moment";

const body = (dailyCelebrations, laterCelebrations) => {
  return `Am onoarea sa va salut,

    ${dailyCelebrations?.length ? "Sarbatoritii zilei de astazi sunt:" : "Astazi nu exista sarbatoriti in directie!"} 
    ${dailyCelebrations?.map((employee) => `<br>${employee.first_name} ${employee.last_name} ${moment(employee.date_of_birth).format("DD MMM")}`)}
    
    ${laterCelebrations?.length ? "Aniversari in urmatoarele zile (3 zile): " : "Nu exista nicio aniversare in urmatoarele 3 zile."}
    ${laterCelebrations?.map((employee) => `<br>${employee.first_name} ${employee.last_name} ${moment(employee.date_of_birth).format("DD MMM")}`)}`;
};

const subject = () => {
  return "La multi ani!";
};

export const emailFormatter = {
  body,
  subject,
};
