import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { redisClient } from './redis.js';

const port = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});
await redisClient.connect();
app.listen(port);
