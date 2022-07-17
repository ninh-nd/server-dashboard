import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import accountRoute from './routes/account.js';

const app = express();
const port = 5000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.SESSION_SECRET));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to MongoDB'));

app.use('/v1/account', accountRoute);
// Test route
app.get('/', (req, res) => {
  console.log(req.session);
  res.send('<h1>Session test</h1>');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
