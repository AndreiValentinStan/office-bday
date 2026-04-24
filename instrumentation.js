// used to initialize DB
import { sequelize } from "./db/connectionDB";


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
