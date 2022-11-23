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
var passport_config_exports = {};
__export(passport_config_exports, {
  default: () => passport_config_default
});
module.exports = __toCommonJS(passport_config_exports);
var import_bcrypt = __toESM(require("bcrypt"));
const LocalStrategy = require("passport-local").Strategy;
function initialize(passport, getAccountByUsername, getAccountById) {
  const authenticateUser = async (username, password, done) => {
    const account = getAccountByUsername(username);
    if (account == null) {
      return done(null, false, { message: "No user with that username" });
    }
    try {
      if (await import_bcrypt.default.compare(password, account.account.password)) {
        return done(null, account);
      }
      return done(null, false, { message: "Password incorrect" });
    } catch (e) {
      return done(e);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "username" }, authenticateUser));
  passport.serializeUser((account, done) => done(null, account.id));
  passport.deserializeUser((id, done) => done(null, getAccountById(id)));
}
var passport_config_default = initialize;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=passport-config.js.map
