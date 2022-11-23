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
var projectManager_exports = {};
__export(projectManager_exports, {
  ProjectManager: () => ProjectManager,
  projectManagerSchema: () => projectManagerSchema
});
module.exports = __toCommonJS(projectManager_exports);
var import_mongoose = require("mongoose");
const projectManagerSchema = new import_mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  account: {
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  company: String,
  projectOwn: [{
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  }]
});
const ProjectManager = (0, import_mongoose.model)("ProjectManager", projectManagerSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProjectManager,
  projectManagerSchema
});
//# sourceMappingURL=projectManager.js.map
