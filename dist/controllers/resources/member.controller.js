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
var member_controller_exports = {};
__export(member_controller_exports, {
  assignTask: () => assignTask,
  create: () => create,
  get: () => get,
  joinProject: () => joinProject,
  remove: () => remove,
  update: () => update
});
module.exports = __toCommonJS(member_controller_exports);
var import_member = require("../../models/member");
var import_responseFormat = require("../../utils/responseFormat");
async function get(req, res) {
  try {
    const member = await import_member.Member.findById(req.params.id).populate("activityHistory");
    return res.status(200).json((0, import_responseFormat.successResponse)(member, "Member found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function create(req, res) {
  try {
    const member = await import_member.Member.create(req.body);
    return res.status(200).json((0, import_responseFormat.successResponse)(member, "Member created"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function update(req, res) {
  try {
    const member = await import_member.Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json((0, import_responseFormat.successResponse)(member, "Member updated"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function remove(req, res) {
  import_member.Member.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err != null) {
      return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
    }
    if (!doc) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("Member not found"));
    }
    return res.status(200).json((0, import_responseFormat.successResponse)(doc, "Member deleted"));
  });
}
async function assignTask(req, res) {
  try {
    const member = await import_member.Member.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { taskAssigned: req.body.taskId } },
      { new: true }
    );
    return res.status(200).json((0, import_responseFormat.successResponse)(member, "Task assigned"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function joinProject(req, res) {
  try {
    const member = await import_member.Member.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { projectParticipated: req.body.projectId } },
      { new: true }
    );
    return res.status(200).json((0, import_responseFormat.successResponse)(member, "Project joined"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assignTask,
  create,
  get,
  joinProject,
  remove,
  update
});
//# sourceMappingURL=member.controller.js.map
