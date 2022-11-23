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
var account_exports = {};
__export(account_exports, {
  Account: () => Account,
  accountSchema: () => accountSchema
});
module.exports = __toCommonJS(account_exports);
var import_mongoose = require("mongoose");
var import_thirdParty = require("./thirdParty.js");
const accountSchema = new import_mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  thirdParty: [{
    type: import_thirdParty.thirdPartySchema,
    default: []
  }]
});
const Account = (0, import_mongoose.model)("Account", accountSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Account,
  accountSchema
});
//# sourceMappingURL=account.js.map
