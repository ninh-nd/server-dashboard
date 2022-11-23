"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_config = require("dotenv/config");
var import_cors = __toESM(require("cors"));
var import_express = __toESM(require("express"));
var import_mongoose = __toESM(require("mongoose"));
var import_express_session = __toESM(require("express-session"));
var import_connect_mongo = __toESM(require("connect-mongo"));
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_morgan = __toESM(require("morgan"));
var import_account = __toESM(require("./src/routes/auth/account.js"));
const app = (0, import_express.default)();
const port = 5e3;
app.use((0, import_morgan.default)("dev"));
app.use(import_express.default.json());
app.use((0, import_cors.default)({
  origin: "http://localhost:3000"
}));
app.use((0, import_cookie_parser.default)(process.env.SESSION_SECRET));
import_mongoose.default.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = import_mongoose.default.connection;
app.use((0, import_express_session.default)({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: import_connect_mongo.default.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    maxAge: 1e3 * 60 * 60 * 24
  }
}));
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to MongoDB"));
app.use("/v1/account", import_account.default);
app.get("/", (req, res) => {
  console.log(req.session);
  res.send("<h1>Session test</h1>");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=authServer.js.map
