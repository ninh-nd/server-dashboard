import { createClient, RedisClientType } from "redis";
import * as dotenv from "dotenv";
dotenv.config();
const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});
const DEFAULT_TTL = 60 * 60 * 24; // 1 day
export { redisClient, DEFAULT_TTL };
