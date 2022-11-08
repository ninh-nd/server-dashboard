import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import taskRoute from './src/routes/resources/task.js';
import thirdPartyRoute from './src/routes/resources/thirdParty.js';
import projectRoute from './src/routes/resources/project.js';
import phaseRoute from './src/routes/resources/phase.js';
import memberRoute from './src/routes/resources/member.js';
import activityRoute from './src/routes/resources/activityHistory.js';
import pmRoute from './src/routes/resources/projectManager.js';
import accountRoute from './src/routes/auth/account.js';

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://client-dashboard.up.railway.app'],
}));
app.use(morgan('dev'));
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 150, // limit each IP to 150 requests per windowMs
});
app.use(limiter);
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
