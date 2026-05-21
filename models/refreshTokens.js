import { STRING, DATE, ENUM, UUIDV4, UUID } from "sequelize";
import { sequelize } from "../db/connectionDB";
import Sessions from "./session";

const RefreshTokens = sequelize.define("RefreshTokens", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    unique: true,
    primaryKey: true,
  },
  session_id: {
    type: UUID,
    defaultValue:UUIDV4,
    allowNull: false,
  },
  token_hash: {
    type: STRING,
    unique: true,
  },
  revocation_time: {
    type: DATE,
  },
}, {tableName: 'refresh_tokens', freezeTableName: true});

Sessions.hasMany(RefreshTokens, {
  foreignKey: "session_id",
});

RefreshTokens.belongsTo(Sessions, {
  foreignKey: "session_id",
});

export default RefreshTokens;
