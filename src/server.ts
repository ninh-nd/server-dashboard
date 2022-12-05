require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
import mongoose from 'mongoose'
import app from './app'
import { redisClient } from './redis'

const port = process.env.PORT || 3001
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be defined')
}
mongoose.connect(process.env.MONGO_URI)
redisClient.connect().catch((err) => {
  console.error(err)
})

app.listen(port)
