import RedisStore from "connect-redis";
import cors from "cors";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import { envVariables } from "./env";
import initialize from "./passport.config";
import redis from "./redis";
import accountRoute from "./routes/account";
import activityRoute from "./routes/activityHistory";
import artifactRoute from "./routes/artifact";
import authRoute from "./routes/auth";
import cweRoute from "./routes/cwe";
import permissionRoute from "./routes/permission";
import phaseRoute from "./routes/phase";
import projectRoute from "./routes/project";
import taskRoute from "./routes/task";
import thirdPartyRoute from "./routes/thirdParty";
import threatRoute from "./routes/threat";
import ticketRoute from "./routes/ticket";
import userRoute from "./routes/user";
import vulnerabilityRoute from "./routes/vulnerability";
import webhookRoute from "./routes/webhook";
envVariables.parse(process.env);
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://client-dashboard.up.railway.app",
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 150, // limit each IP to 150 requests per windowMs
});
app.use(limiter);
app.get("/", (req: Request, res: Response) => {
  res.send("server-dashboard API. Start using with /{resource}");
});
const redisStore = new RedisStore({
  client: redis,
});
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
initialize(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoute);
app.use("/account", accountRoute);
app.use("/task", taskRoute);
app.use("/thirdParty", thirdPartyRoute);
app.use("/user", userRoute);
app.use("/phase", phaseRoute);
app.use("/project", projectRoute);
app.use("/activity/github", activityRoute);
app.use("/vuln", vulnerabilityRoute);
app.use("/threat", threatRoute);
app.use("/artifact", artifactRoute);
app.use("/ticket", ticketRoute);
app.use("/permission", permissionRoute);
app.use("/cwe", cweRoute);
app.use("/webhook", webhookRoute);
export default app;
