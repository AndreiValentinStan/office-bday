import { DATE, INTEGER, STRING, UUID, UUIDV4 } from "sequelize";
import { sequelize } from "../db/connectionDB";

const notificationDate = sequelize.define(
  "notification_dates",
  {
    id: {
      type: INTEGER,
      unique: true,
      primaryKey: true,
    },
    last_sended: {
      type: DATE,
      allowNull: false,
    },
  }
);

export default notificationDate;
