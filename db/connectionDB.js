import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const {
  DB_HOST,
  DB_PASSWD,
  DB_USER,
  DB_PORT,
  DB_DIALECT,
  DB_NAME,
  ENVIROMENT,
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWD, {
  dialect: DB_DIALECT,
  host: DB_HOST,
  port: DB_PORT,
  dialectModule: mysql2,
  logging: ENVIROMENT === 'dev'
});
