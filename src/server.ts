import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app'
import { redisClient } from './redis'

const port = process.env.PORT || 3001
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be defined')
}
mongoose.connect(process.env.MONGO_URI)
const connect = async () => { await redisClient.connect() }
connect()
app.listen(port)
