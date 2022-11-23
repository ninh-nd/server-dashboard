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
var projectManager_controller_exports = {};
__export(projectManager_controller_exports, {
  addProjectOwn: () => addProjectOwn,
  create: () => create,
  get: () => get,
  getProjectOwn: () => getProjectOwn,
  remove: () => remove,
  update: () => update
});
module.exports = __toCommonJS(projectManager_controller_exports);
var import_projectManager = require("../../models/projectManager");
var import_responseFormat = require("../../utils/responseFormat");
async function get(req, res) {
  try {
    const pm = await import_projectManager.ProjectManager.findById(req.params.id);
    return res.status(200).json((0, import_responseFormat.successResponse)(pm, "Project Manager found"));
  } catch (err) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function create(req, res) {
  try {
    const pm = await import_projectManager.ProjectManager.create(req.body);
    return res.status(201).json((0, import_responseFormat.successResponse)(pm, "Project Manager created"));
  } catch (err) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function update(req, res) {
  try {
    const pm = await import_projectManager.ProjectManager.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json((0, import_responseFormat.successResponse)(pm, "Project Manager updated"));
  } catch (err) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function remove(req, res) {
  import_projectManager.ProjectManager.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err != null) {
      return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
    }
    if (!doc) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("Project Manager not found"));
    }
    return res.status(200).json((0, import_responseFormat.successResponse)(doc, "Project Manager deleted"));
  });
}
async function addProjectOwn(req, res) {
  try {
    const pm = await import_projectManager.ProjectManager.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { projectOwn: req.body.projectId } },
      { new: true }
    );
    return res.status(200).json((0, import_responseFormat.successResponse)(pm, "Project added to Project Manager"));
  } catch (err) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function getProjectOwn(req, res) {
  try {
    const pm = await import_projectManager.ProjectManager.findById(req.params.id).populate("projectOwn");
    if (pm == null) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("Project Manager not found"));
    }
    const data = { projects: pm.projectOwn };
    return res.status(200).json((0, import_responseFormat.successResponse)(data, ""));
  } catch (err) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addProjectOwn,
  create,
  get,
  getProjectOwn,
  remove,
  update
});
//# sourceMappingURL=projectManager.controller.js.map
