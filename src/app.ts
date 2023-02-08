import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import taskRoute from "./routes/resources/task";
import thirdPartyRoute from "./routes/resources/thirdParty";
import projectRoute from "./routes/resources/project";
import phaseRoute from "./routes/resources/phase";
import memberRoute from "./routes/resources/member";
import activityRoute from "./routes/resources/activityHistory";
import pmRoute from "./routes/resources/projectManager";
import accountRoute from "./routes/auth/account";
import githubConfigRoute from "./routes/resources/githubConfig";
import vulnerabilityRoute from "./routes/resources/vulnerability";
import artifactRoute from "./routes/resources/artifact";
import threatRoute from "./routes/resources/threat";
import ticketRoute from "./routes/resources/ticket";
import initialize from "./passport-config";
import { Request, Response } from "express";
import crypto from "crypto";
import { redisClient } from "./redisServer";
import { Artifact } from "models/artifact";
import { CWE } from "models/cwe";
import { PhasePreset } from "models/phasePreset";
import { Threat } from "models/threat";
import { Ticket } from "models/ticket";
import { Vulnerability } from "models/vulnerability";
let RedisStore = require("connect-redis")(session);
const app = express();
function registerModels() {
  Artifact.find();
  CWE.find();
  PhasePreset.find();
  Threat.find();
  Ticket.find();
  Vulnerability.find();
}
registerModels();
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
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret:
      process.env.SESSION_SECRET || crypto.randomBytes(20).toString("hex"),
    resave: false,
    saveUninitialized: false,
  })
);
initialize(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use("/account", accountRoute);
app.use("/task", taskRoute);
app.use("/thirdParty", thirdPartyRoute);
app.use("/thirdParty/github", githubConfigRoute);
app.use("/member", memberRoute);
app.use("/phase", phaseRoute);
app.use("/project", projectRoute);
app.use("/activity/github", activityRoute);
app.use("/pm", pmRoute);
app.use("/vuln", vulnerabilityRoute);
app.use("/threat", threatRoute);
app.use("/artifact", artifactRoute);
app.use("/ticket", ticketRoute);
export default app;
