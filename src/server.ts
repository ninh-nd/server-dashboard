import * as dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import app from './app'
import { redisClient } from './redisServer'

const port = process.env.PORT || 3001
if (!process.env.MONGO_URL) {
  throw new Error('MONGO_URL must be defined')
}
mongoose.connect(process.env.MONGO_URL)
redisClient.connect().catch((err: any) => {
  console.error(err)
})

app.listen(port)
