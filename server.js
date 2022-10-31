import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import taskRoute from './routes/resources/task.js';
import thirdPartyRoute from './routes/resources/thirdParty.js';
import projectRoute from './routes/resources/project.js';
import phaseRoute from './routes/resources/phase.js';
import memberRoute from './routes/resources/member.js';
import activityRoute from './routes/resources/activityHistory.js';
import pmRoute from './routes/resources/projectManager.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
}));
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
