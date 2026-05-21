import moment from "moment";
import z from "zod";

const { NEXT_PUBLIC_MAXIMUM_AGE, NEXT_PUBLIC_MINIMUM_AGE } = process.env;

export const birthDateSchema = z
  .string()
  .regex(/[0-9]{2}-[0-9]{2}-[0-9]{4}/, "Birth date must have dd-mm-yyyy format")
  .refine((date) => moment(date, "DD-MM-YYYY").isValid(), {
    message: "invalid date",
  })
  .transform((birthDate) => moment.utc(birthDate, "DD-MM-YYYY").toDate())
  .refine(
    (formatedDate) => {
      const maxAge = NEXT_PUBLIC_MAXIMUM_AGE;
      const minAge = NEXT_PUBLIC_MINIMUM_AGE;
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
      message: `Birth date is out of interval; It must be greater than ${NEXT_PUBLIC_MINIMUM_AGE} and lower than ${NEXT_PUBLIC_MAXIMUM_AGE}`,
    },
  );
