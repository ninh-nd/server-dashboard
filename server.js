import 'dotenv/config';
import morgan from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import taskRoute from './routes/task.js';
import accountRoute from './routes/account.js';
import thirdPartyRoute from './routes/thirdParty.js';
import projectRoute from './routes/project.js';
import phaseRoute from './routes/phase.js';
import memberRoute from './routes/member.js';
import activityRoute from './routes/activityHistory.js';

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

app.use(morgan('common'));
app.use(bodyParser.json());

const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to MongoDB'));

app.use('/v1/task', taskRoute);
app.use('/v1/account', accountRoute);
app.use('/v1/thirdParty', thirdPartyRoute);
app.use('/v1/member', memberRoute);
app.use('/v1/phase', phaseRoute);
app.use('/v1/project', projectRoute);
app.use('/v1/activity/github', activityRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
