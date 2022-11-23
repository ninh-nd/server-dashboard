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
var thirdParty_exports = {};
__export(thirdParty_exports, {
  ThirdParty: () => ThirdParty,
  thirdPartySchema: () => thirdPartySchema
});
module.exports = __toCommonJS(thirdParty_exports);
var import_mongoose = require("mongoose");
const thirdPartySchema = new import_mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});
const ThirdParty = (0, import_mongoose.model)("ThirdParty", thirdPartySchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ThirdParty,
  thirdPartySchema
});
//# sourceMappingURL=thirdParty.js.map
