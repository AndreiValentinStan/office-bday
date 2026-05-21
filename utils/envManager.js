function getEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable ${name}`);
  return value;
}

export const env = {
  DB_HOST: getEnv("DB_HOST"),
  DB_PASSWD: getEnv("DB_PASSWD"),
  DB_USER: getEnv("DB_USER"),
  DB_PORT: getEnv("DB_PORT"),
  DB_NAME: getEnv("DB_NAME"),
  DB_DIALECT: getEnv("DB_DIALECT"),
  ENVIROMENT: getEnv("ENVIROMENT"),
  HMAC_SECRET: getEnv("HMAC_SECRET"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  REDIS_URL: getEnv("REDIS_URL"),
};
