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
var member_exports = {};
__export(member_exports, {
  Member: () => Member,
  memberSchema: () => memberSchema
});
module.exports = __toCommonJS(member_exports);
var import_mongoose = require("mongoose");
const memberSchema = new import_mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  account: {
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Account"
  },
  company: String,
  taskAssigned: [{
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Task",
    default: []
  }],
  activityHistory: [{
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "ActivityHistory",
    default: []
  }],
  projectIn: [{
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: []
  }]
});
const Member = (0, import_mongoose.model)("Member", memberSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Member,
  memberSchema
});
//# sourceMappingURL=member.js.map
