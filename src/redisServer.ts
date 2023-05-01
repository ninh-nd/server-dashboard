import { createClient, RedisClientType } from "redis";
import * as dotenv from "dotenv";
dotenv.config();
const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});
export default redisClient;
