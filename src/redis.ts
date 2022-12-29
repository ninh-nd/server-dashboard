// @ts-ignore
import { createClient } from 'redis'
import * as dotenv from 'dotenv'
dotenv.config()
const redisClient = createClient({ url: process.env.REDIS_URI, legacyMode: true })
const DEFAULT_TTL = 60 * 60 * 24 // 1 day
export {
  redisClient,
  DEFAULT_TTL
}
