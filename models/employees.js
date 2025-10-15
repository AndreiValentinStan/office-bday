import { sequelize } from "../db/connectionDB";

import { STRING, UUIDV4, UUID, DATE } from "sequelize";

const Employee = sequelize.define("Employees", {
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
      len: [2, 50],
    },
  },
  last_name: {
    type: STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
    },
  },
  parent_first_name: {
    type: STRING,
    allowNull: true,
    validate: {
        len: [2, 50],
        isAlphanumeric: true
    }
  },
  date_of_birth: {
    type: DATE,
    allowNull: false,
    validate: {
        isDate: true
    }
  }
});

export default Employee;
