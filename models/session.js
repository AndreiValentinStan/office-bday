<<<<<<< HEAD
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
=======
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
    values: ['active', 'expired', 'revoked'],
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
>>>>>>> af93fd070ad0f27daf24da9886db9db7ee391b66
