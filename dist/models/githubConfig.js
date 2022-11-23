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
var githubConfig_exports = {};
__export(githubConfig_exports, {
  GithubConfig: () => GithubConfig,
  githubConfigSchema: () => githubConfigSchema
});
module.exports = __toCommonJS(githubConfig_exports);
var import_mongoose = require("mongoose");
const githubConfigSchema = new import_mongoose.Schema({
  projectId: {
    type: import_mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project"
  },
  accessToken: {
    type: String,
    required: true
  },
  repo: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
});
const GithubConfig = (0, import_mongoose.model)("GithubConfig", githubConfigSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GithubConfig,
  githubConfigSchema
});
//# sourceMappingURL=githubConfig.js.map
