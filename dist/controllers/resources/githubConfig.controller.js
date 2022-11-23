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
var githubConfig_controller_exports = {};
__export(githubConfig_controller_exports, {
  create: () => create,
  get: () => get,
  update: () => update
});
module.exports = __toCommonJS(githubConfig_controller_exports);
var import_mongoose = __toESM(require("mongoose"));
var import_githubConfig = require("../../models/githubConfig");
var import_responseFormat = require("../../utils/responseFormat");
async function get(req, res) {
  const { id } = req.params;
  if (!import_mongoose.default.Types.ObjectId.isValid(id)) {
    return res.status(400).json((0, import_responseFormat.errorResponse)("Invalid project id"));
  }
  try {
    const githubConfig = await import_githubConfig.GithubConfig.findOne({ projectId: id });
    if (githubConfig != null) {
      return res.status(200).json((0, import_responseFormat.successResponse)(githubConfig, "Github config found"));
    }
    return res.status(404).json((0, import_responseFormat.errorResponse)("No Github config found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function create(req, res) {
  const githubConfig = new import_githubConfig.GithubConfig(req.body);
  try {
    const newGithubConfig = await githubConfig.save();
    return res.status(201).json((0, import_responseFormat.successResponse)(newGithubConfig, "Github config created"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function update(req, res) {
  const { id } = req.params;
  try {
    const githubConfig = await import_githubConfig.GithubConfig.findOneAndUpdate(
      { projectId: id },
      req.body,
      { new: true }
    );
    if (githubConfig != null) {
      return res.status(200).json((0, import_responseFormat.successResponse)(githubConfig, "Github config updated"));
    }
    return res.status(404).json((0, import_responseFormat.errorResponse)("No Github config found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  create,
  get,
  update
});
//# sourceMappingURL=githubConfig.controller.js.map
