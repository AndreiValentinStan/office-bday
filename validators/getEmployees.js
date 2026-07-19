import z, { success } from "zod";
import Employee from "@/models/employees";
import moment from "moment";
import { env } from "process";

function convertToNumber(value) {
  console.log({ val: value });
  if (typeof value === "string" && value.trim() !== "") {
    const number = Number(value);
    return isNaN(number) ? "" : number;
  }
  return undefined;
}

const validationSchema = z
  .object({
    count: z.preprocess(
      convertToNumber,
      z
        .number("Results count must be a number")
        .int("Results count must be an integer")
        .min(20, "Results count must be at least 20")
        .max(100, "Result count can be maximum 100")
        .optional()
        .refine(
          (count) => {
            if (![20, 50, 100].includes(count)) return false;
            return true;
          },
          { message: "Page count must be 20, 50 or 100" },
        ),
    ),
    page: z.preprocess(
      convertToNumber,
      z
        .number("Page number must be a number")
        .int("Page number must be an integer")
        .min(1, "Page number must be greater than 1")
        .optional(),
    ),
    first_name: z
      .string()
      .min(2, "First Name must be at least 2 characters long")
      .max(50, "First Name must be less than 50 characters long")
      .regex(/^[a-zA-Z]+$/, "First name must contain only letters")
      .optional(),
    last_name: z
      .string()
      .min(2, "Last Name must be at least 2 characters long")
      .max(50, "Last Name must be less than 50 characters long")
      .regex(/^[a-zA-Z]+$/, "Last name must contain only letters")
      .optional(),
    age: z.preprocess(
      convertToNumber,
      z
        .number("Age must be a number")
        .int("Age must be an integer number")
        .min(18, "Age must be at least 18")
        .max(70, "Age must be max 70")
        .optional(),
    ),
    day: z.preprocess(
      convertToNumber,
      z
        .number("Day must be a number")
        .int("Day must be an integer")
        .min(1, "Day must be at least 1")
        .max(31, "Day must be max 31")
        .optional(),
    ),
    month: z.preprocess(
      convertToNumber,
      z
        .number("Month must be a number")
        .int("Month must be an integer")
        .min(1, "Month must be at least 1")
        .max(12, "Month must be max 12")
        .optional(),
    ),
    year: z.preprocess(
      convertToNumber,
      z
        .number("Year must be a number")
        .int("Year must be an integer")
        .optional(),
    ),
  })
  .refine(
    async (params) => {
      // check if page number is valid by comparing recieved value with number of record from db/desired page count
      const { count, _rows } = await Employee.findAndCountAll();
      let { page, count: pageCount } = params;
      if (!page) page = 1;
      if (!pageCount) pageCount = 20;

      if (page * pageCount > count + pageCount) return false;
      return true;
    },
    { message: "Altered page number or limit query detected" },
  )
  .refine(
    (params) => {
      // validate years: birth date year recieved by filtering system
      const { year } = params;
      const { NEXT_PUBLIC_MAXIMUM_AGE, NEXT_PUBLIC_MINIMUM_AGE } = process.env;
      if (!year) return true;
      if (
        year > moment().year() - NEXT_PUBLIC_MINIMUM_AGE ||
        year < moment().year() - NEXT_PUBLIC_MAXIMUM_AGE
      )
        return false;
      return true;
    },
    { message: "Birth year out of interval" },
  );

export default validationSchema;
