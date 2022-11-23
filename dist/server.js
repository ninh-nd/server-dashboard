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
var import_mongoose = __toESM(require("mongoose"));
var import_app = __toESM(require("./app"));
var import_redis = require("./redis.js");
const port = process.env.PORT || 3001;
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI must be defined");
}
import_mongoose.default.connect(process.env.MONGO_URI);
const connect = async () => {
  await import_redis.redisClient.connect();
};
connect();
import_app.default.listen(port);
//# sourceMappingURL=server.js.map
