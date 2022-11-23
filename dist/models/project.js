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
var project_exports = {};
__export(project_exports, {
  Project: () => Project,
  projectSchema: () => projectSchema
});
module.exports = __toCommonJS(project_exports);
var import_mongoose = require("mongoose");
const projectSchema = new import_mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  description: String,
  startDate: Date,
  endDate: Date,
  createdBy: String,
  updatedBy: String,
  phaseList: [{
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Phase",
    default: []
  }]
}, { timestamps: true });
const Project = (0, import_mongoose.model)("Project", projectSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Project,
  projectSchema
});
//# sourceMappingURL=project.js.map
