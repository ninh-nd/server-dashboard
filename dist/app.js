"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_morgan = __toESM(require("morgan"));
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var import_express_session = __toESM(require("express-session"));
var import_passport = __toESM(require("passport"));
var import_task = __toESM(require("./routes/resources/task"));
var import_thirdParty = __toESM(require("./routes/resources/thirdParty"));
var import_project = __toESM(require("./routes/resources/project"));
var import_phase = __toESM(require("./routes/resources/phase"));
var import_member = __toESM(require("./routes/resources/member"));
var import_activityHistory = __toESM(require("./routes/resources/activityHistory"));
var import_projectManager = __toESM(require("./routes/resources/projectManager"));
var import_account = __toESM(require("./routes/auth/account"));
var import_passport_config = __toESM(require("./passport-config"));
var import_account2 = require("./models/account");
const app = (0, import_express.default)();
app.use(import_express.default.json());
app.use((0, import_cors.default)({
  origin: ["http://localhost:5173", "https://client-dashboard.up.railway.app"]
}));
app.use((0, import_morgan.default)("dev"));
const limiter = (0, import_express_rate_limit.default)({
  windowMs: 1 * 60 * 1e3,
  max: 150
});
app.use(limiter);
app.get("/", (req, res) => {
  res.send("server-dashboard API. Start using with /v1/{resource}");
});
(0, import_passport_config.default)(
  import_passport.default,
  (username) => import_account2.Account.find({ username }),
  (id) => import_account2.Account.findById(id)
);
app.use((0, import_express_session.default)({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false
}));
app.use(import_passport.default.initialize());
app.use(import_passport.default.session());
app.use("/v1/account", import_account.default);
app.use("/v1/task", import_task.default);
app.use("/v1/thirdParty", import_thirdParty.default);
app.use("/v1/member", import_member.default);
app.use("/v1/phase", import_phase.default);
app.use("/v1/project", import_project.default);
app.use("/v1/activity/github", import_activityHistory.default);
app.use("/v1/pm", import_projectManager.default);
var app_default = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=app.js.map
