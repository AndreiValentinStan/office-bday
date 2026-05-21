import { sequelize } from "../db/connectionDB";
import { compare, genSalt, hash } from "bcryptjs";

import { STRING, UUIDV4, UUID, ENUM } from "sequelize";

const User = sequelize.define(
  "Users",
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
    phone: {
      type: STRING,
      allowNull: true,
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 100],
        isEmail: {
          msg: "Invalid email address",
        },
      },
    },
    status: {
      type: ENUM,
      values: ["ACTIVE", "PENDING", "REVOKED"],
      defaultValue: "PENDING",
    },
    password: {
      type: STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    freezeTableName: true,
  },
);

User.beforeCreate(async (user) => {
  const salt = await genSalt();
  const hashedPasswd = await hash(user.password, salt);
  user.password = hashedPasswd;
});

User.beforeBulkUpdate(async (user) => {
  console.log({ user });
  if (user?.attributes?.password) {
    const salt = await genSalt();
    const hashedPassword = await hash(user.attributes.password, salt);
    user.attributes.password = hashedPassword;
  }
});

export default User;
