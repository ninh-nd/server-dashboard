"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var redis_exports = {};
__export(redis_exports, {
  DEFAULT_TTL: () => DEFAULT_TTL,
  redisClient: () => redisClient
});
module.exports = __toCommonJS(redis_exports);
var import_redis = require("redis");
var import_config = require("dotenv/config");
const redisClient = (0, import_redis.createClient)({ url: process.env.REDIS_URI });
const DEFAULT_TTL = 60 * 60 * 24;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_TTL,
  redisClient
});
//# sourceMappingURL=redis.js.map
