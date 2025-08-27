import { sequelize } from "../db/connectionDB";
import { genSalt, hash } from "bcryptjs";

import { STRING, UUIDV4, UUID, ENUM } from "sequelize";

const User = sequelize.define("Users", {
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
    values: ['ACTIVE', 'PENDING', 'INACTIVE'],
    defaultValue: 'PENDING'
  },
  password: {
    type: STRING,
    allowNull: false,
  },
});

User.beforeCreate(async (user) => {
  const salt = await genSalt();
  const hashedPasswd = await hash(user.password, salt);
  user.password = hashedPasswd;
});

export default User;
