import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import taskRoute from './routes/task.js';
import thirdPartyRoute from './routes/thirdParty.js';
import projectRoute from './routes/project.js';
import phaseRoute from './routes/phase.js';
import memberRoute from './routes/member.js';
import activityRoute from './routes/activityHistory.js';
import pmRoute from './routes/projectManager.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
// morgan.token('body', (req) => JSON.stringify(req.body));
// app.use(morgan(':method :url :body'));
app.use(morgan('dev'));
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to MongoDB'));

app.use('/v1/task', taskRoute);
app.use('/v1/thirdParty', thirdPartyRoute);
app.use('/v1/member', memberRoute);
app.use('/v1/phase', phaseRoute);
app.use('/v1/project', projectRoute);
app.use('/v1/activity/github', activityRoute);
app.use('/v1/pm', pmRoute);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
