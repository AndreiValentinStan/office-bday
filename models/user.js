import { DataTypes } from "sequelize";
import { sequelize } from "../db/connectionDB";
import { genSalt, hash } from "bcrypt";

const User = sequelize.define("Users", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 100],
      isEmail: {
        msg: "Please provide an valid email",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.beforeCreate(async (user) => {
      const salt = await genSalt();
      const hashedPasswd = await hash(user.password, salt);
      user.password = hashedPasswd;
});

export default User;
