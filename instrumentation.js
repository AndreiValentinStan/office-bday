// used to initialize DB
import { Axios } from "axios";
import { sequelize } from "./db/connectionDB";
import RefreshTokens from "./models/refreshTokens";
import Sessions from "./models/session";
import User from "./models/user";
import { Employee } from "./models";

export async function register() {
  // init db
  try {
    await sequelize.authenticate();
    console.log("Database connected succesfully: ");
    await sequelize.sync(/* { force: true } */);
    console.log("Database syncronized successfully: ");
  } catch (err) {
    console.log("Database Error: ", err.message);
  }
}
