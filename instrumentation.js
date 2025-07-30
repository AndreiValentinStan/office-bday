// used to initialize DB
import { Axios } from "axios";
import { sequelize } from "./db/connectionDB";
import RefreshTokens from "./models/refreshTokens";
import Sessions from "./models/session";
import User from "./models/user";

export async function register() {
  // init db
  try {
    await sequelize.authenticate();
    await User.sync();
    await Sessions.sync();
    await RefreshTokens.sync();
    console.log("Database connected succesfully: ");
    await sequelize.sync({ alter: true });
    console.log("Database syncronized successfully: ");
  } catch (err) {
    console.log("Database Error: ", err.message);
  }
}
