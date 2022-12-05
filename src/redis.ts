import { createClient } from 'redis'
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const redisClient = createClient({ url: process.env.REDIS_URI, legacyMode: true })
const DEFAULT_TTL = 60 * 60 * 24 // 1 day

export {
  redisClient,
  DEFAULT_TTL
}
