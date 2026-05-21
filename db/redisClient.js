import { env } from "@/utils/envManager";
import { createClient } from "redis";

let client = null;
const redisUrl = env.REDIS_URL;

try {
  client = createClient({ url: redisUrl }).on("error", (err) => {
    throw err;
  });
  await client.connect();
} catch (err) {
  console.log("Can`t create Redis client!", err);
  throw err;
}

export const redis = client;
