import z, { success } from "zod";
import Employee from "@/models/employees";

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
  );

export default validationSchema;
