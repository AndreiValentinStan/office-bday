import moment from "moment";
import z from "zod";

export const employeeDataSchema = z.object({
  firstName: z
    .string()
    .min(2, "First Name must be at least 2 characters long")
    .max(50, "First Name must be less than 50 characters long")
    .regex(
      /^[a-zA-Z-/]+$/,
      "First name must contain only letters and optional '-' character",
    ),
  lastName: z
    .string()
    .min(2, "Last Name must be at least 2 characters long")
    .max(50, "Last Name must be less than 50 characters long")
    .regex(
      /^[a-zA-Z-/]+$/,
      "Last name must contain only letters and optional '-' character",
    ),
  birthDate: z
    .string()
    .regex(
      /[0-9]{2}-[0-9]{2}-[0-9]{4}/,
      "Birth date must have dd-mm-yyyy format",
    )
    .transform((birthDate) => moment.utc(birthDate, "DD-MM-YYYY").toDate())
    .refine(
      (formatedDate) => {
        const maxAge = process.env.NEXT_PUBLIC_MAXIMUM_AGE;
        const minAge = process.env.NEXT_PUBLIC_MINIMUM_AGE;
        const minimumOffset = moment().subtract(maxAge, "years");
        const maximumOffset = moment().subtract(minAge, "years");
        if (
          moment(formatedDate).isBefore(minimumOffset) ||
          moment(formatedDate).isAfter(maximumOffset)
        )
          return false;
        return true;
      },
      {
        message: `Birth date is out of interval; It must be greater than ${process.env.NEXT_PUBLIC_MINIMUM_AGE} and lower than ${process.env.NEXT_PUBLIC_MAXIMUM_AGE}`,
      },
    ),
  parentName: z
    .string()
    .min(2, "Parent name must be at least 2 characters long")
    .max(100, "Parent name must be maximum 100 characters long")
    .regex(
      /^(?!(?:.* ){5,})[a-zA-Z ]+$/,
      "Parent name must contain only letters and maximum two spaces",
    )
    .optional(),
});

export const updateEmployeeDataSchema = employeeDataSchema.extend({
  id: z.uuidv4(),
});
