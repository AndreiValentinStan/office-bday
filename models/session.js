import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../db/connectionDB";
import User from "./user";

const Session = sequelize.define("Sesison", {
  session_id: {
    type: UUIDV4,
    allowNull: false,
    unique: true,
  },
  csrf_token: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [120],
      msg: "CSRF token length wrong",
    },
  },
});

User.hasOne(Session);
Session.belongsTo(User, {
  foreignKey: "user_id",
});

export default Session;
