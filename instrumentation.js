// used to initialize DB
import { sequelize } from "./db/connectionDB";
import RefreshTokens from "./models/refreshTokens";
import Sessions from "./models/session";
import User from "./models/user";
import Notification from './models/notificationDate';

export async function register() {
  // init db
  try {
    await sequelize.authenticate();
    console.log("Database connected succesfully: ");
    const res = await sequelize.sync( {
      sync: true, 
    });
    
    console.log("Database syncronized successfully: ");
  } catch (err) {
    console.log("Database Error: ", err.message);
  }
}
