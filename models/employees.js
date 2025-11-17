import moment from "moment";
import { sequelize } from "../db/connectionDB";

import { STRING, UUIDV4, UUID, DATE } from "sequelize";
import { CustomError } from "../utils/CustomError";
import { StatusCodes } from "http-status-codes";

const Employee = sequelize.define("Employees",
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      unique: true,
      primaryKey: true,
    },
    first_name: {
      type: STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "first name length must be between 2 and 50",
        },
      },
    },
    last_name: {
      type: STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "last name length must be between 2 and 50",
        },
      },
    },
    parent_first_name: {
      type: STRING,
      allowNull: true,
      validate: {
        len: [2, 50],
        isAlpha: {
          msg: "Parent name must contain only letters",
        },
      },
    },
    date_of_birth: {
      type: DATE,
      allowNull: false,
      validate: {
        dateValidator(date) {
          // check if date has correct format
          if (!moment(date, "DD-MM-YYYY", true))
            throw new CustomError(
              "Can`t save into db due to wrong format: Date must have DD-MM-YYYY format",
              StatusCodes.BAD_REQUEST,
              ""
            );

          // check if date is not "older" than 100 year or from the future
          if (
            !moment()
              .subtract(100, "years")
              .isBefore(moment(date, "DD-MM-YYYY")) ||
            moment(date, "DD-MM-YYYY").isAfter(moment())
          )
            throw new CustomError(
              "Can`t save into db due to wrong value: Date ca`t be older than 100 years or from the future",
              StatusCodes.BAD_REQUEST,
              ""
            );
        },
      },
    },
  },
  {
    tableName: "employees",
    uniqueKeys: {
      employee_unique_key: {
        fields: [
          "first_name",
          "last_name",
          "date_of_birth",
        ],
      },
    },
  }
);

export default Employee;
