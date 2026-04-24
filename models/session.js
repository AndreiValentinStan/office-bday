import { STRING, DATE, ENUM, UUIDV4, UUID } from "sequelize";
import { sequelize } from "../db/connectionDB";
import User from "./user";

const Sessions = sequelize.define("Sessions", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    unique: true,
    primaryKey: true,
  },
  user_id: {
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
  },
  status: {
    type: ENUM,
    values: ['active', 'expired', 'revoked', 'closed'],
    defaultValue: 'active',
    allowNull: false
  },
  changing_status_time: {
    type: DATE,
  },
  changing_status_reason: {
    type: STRING,
  },
});

User.hasMany(Sessions, {
  foreignKey: "user_id",
});

Sessions.belongsTo(User, {
  foreignKey: "user_id",
});

export default Sessions;
