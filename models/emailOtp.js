import { STRING, UUID, UUIDV4 } from "sequelize";
import { sequelize } from "../db/connectionDB";

const emailOtp = sequelize.define(
  "emailOTP",
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      unique: true,
      primaryKey: true,
    },
    otp: {
      type: STRING,
      unique: true,
      allowNull: false,
    },
    issuer_email: {
      type: STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Invalid email address",
        },
      },
    },
  },
  {
    tableName: "email_otp",
    freezeTableName: true,
  },
);
