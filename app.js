import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import taskRoute from './routes/resources/task.js';
import thirdPartyRoute from './routes/resources/thirdParty.js';
import projectRoute from './routes/resources/project.js';
import phaseRoute from './routes/resources/phase.js';
import memberRoute from './routes/resources/member.js';
import activityRoute from './routes/resources/activityHistory.js';
import pmRoute from './routes/resources/projectManager.js';
import accountRoute from './routes/auth/account.js';

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://client-dashboard.up.railway.app'],
}));
app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.send('server-dashboard API. Start using with /v1/{resource}');
});
app.use('/v1/account', accountRoute);
app.use('/v1/task', taskRoute);
app.use('/v1/thirdParty', thirdPartyRoute);
app.use('/v1/member', memberRoute);
app.use('/v1/phase', phaseRoute);
app.use('/v1/project', projectRoute);
app.use('/v1/activity/github', activityRoute);
app.use('/v1/pm', pmRoute);

export default app;
