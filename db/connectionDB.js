import { Sequelize } from "sequelize";
import mysql from "mysql2";
import { env } from "@/utils/envManager";

const { DB_HOST, DB_PASSWD, DB_USER, DB_PORT, DB_DIALECT, DB_NAME } = env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWD, {
  dialect: DB_DIALECT,
  host: DB_HOST,
  port: DB_PORT,
  dialectModule: mysql,
  logging: true,
});
