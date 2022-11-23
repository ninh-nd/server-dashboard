import { createClient } from 'redis'
import 'dotenv/config'
const redisClient = createClient({ url: process.env.REDIS_URI })
const DEFAULT_TTL = 60 * 60 * 24 // 1 day

export {
  redisClient,
  DEFAULT_TTL
}
