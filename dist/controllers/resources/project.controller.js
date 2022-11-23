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
var project_controller_exports = {};
__export(project_controller_exports, {
  addPhaseToProject: () => addPhaseToProject,
  create: () => create,
  get: () => get,
  getProjectMembers: () => getProjectMembers,
  remove: () => remove,
  updateStatus: () => updateStatus
});
module.exports = __toCommonJS(project_controller_exports);
var import_project = require("../../models/project");
var import_member = require("../../models/member");
var import_responseFormat = require("../../utils/responseFormat");
async function get(req, res) {
  try {
    const { projectName } = req.params;
    const project = await import_project.Project.findOne({ name: projectName }).populate({
      path: "phaseList",
      populate: {
        path: "tasks"
      }
    });
    return res.status(200).json((0, import_responseFormat.successResponse)(project, "Project found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function create(req, res) {
  try {
    const project = await import_project.Project.create(req.body);
    return res.status(201).json((0, import_responseFormat.successResponse)(project, "Project created"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function updateStatus(req, res) {
  try {
    const { projectName } = req.params;
    const { status } = req.body;
    const project = await import_project.Project.findOneAndUpdate(
      { name: projectName },
      { status },
      { new: true }
    );
    return res.status(200).json((0, import_responseFormat.successResponse)(project, "Project status updated"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function addPhaseToProject(req, res) {
  try {
    const { projectName } = req.params;
    const { phaseId } = req.body;
    const project = await import_project.Project.findOneAndUpdate(
      { name: projectName },
      {
        $addToSet: {
          phaseList: phaseId
        }
      },
      { new: true }
    );
    return res.status(200).json((0, import_responseFormat.successResponse)(project, "Phase added to project"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function remove(req, res) {
  try {
    const { projectName } = req.params;
    const project = await import_project.Project.findOne({ name: projectName });
    if (project == null) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("Project not found"));
    }
    if (project.createdAt.getTime() + 864e5 > Date.now()) {
      return res.status(403).json((0, import_responseFormat.errorResponse)("Project cannot be deleted"));
    }
    await import_project.Project.findByIdAndDelete(req.params.id);
    return res.status(200).json((0, import_responseFormat.successResponse)(project, "Project deleted"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function getProjectMembers(req, res) {
  try {
    const { projectName } = req.params;
    const project = await import_project.Project.findOne({ name: projectName });
    if (project == null) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("Project not found"));
    }
    const members = await import_member.Member.find({ projectId: project._id }).populate("activityHistory").populate("taskAssigned");
    return res.status(200).json((0, import_responseFormat.successResponse)(members, "Members found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addPhaseToProject,
  create,
  get,
  getProjectMembers,
  remove,
  updateStatus
});
//# sourceMappingURL=project.controller.js.map
