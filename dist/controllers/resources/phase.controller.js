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
var phase_controller_exports = {};
__export(phase_controller_exports, {
  addTaskToPhase: () => addTaskToPhase,
  create: () => create,
  get: () => get,
  remove: () => remove,
  update: () => update
});
module.exports = __toCommonJS(phase_controller_exports);
var import_phase = require("../../models/phase");
var import_responseFormat = require("../../utils/responseFormat");
async function get(req, res) {
  try {
    const phase = await import_phase.Phase.findById(req.params.id);
    return res.status(200).json((0, import_responseFormat.successResponse)(phase, "Phase found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function create(req, res) {
  try {
    const newPhase = new import_phase.Phase(req.body);
    await newPhase.save();
    return res.status(201).json((0, import_responseFormat.successResponse)(newPhase, "Phase created"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function update(req, res) {
  try {
    const updatedPhase = await import_phase.Phase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json((0, import_responseFormat.successResponse)(updatedPhase, "Phase updated"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function remove(req, res) {
  import_phase.Phase.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err != null) {
      return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
    }
    if (!doc) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("Phase not found"));
    }
    return res.status(200).json((0, import_responseFormat.successResponse)(doc, "Phase deleted"));
  });
}
async function addTaskToPhase(req, res) {
  try {
    const updatedPhase = await import_phase.Phase.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { tasks: req.body.taskId } },
      { new: true }
    );
    return res.status(200).json((0, import_responseFormat.successResponse)(updatedPhase, "Task added to phase"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addTaskToPhase,
  create,
  get,
  remove,
  update
});
//# sourceMappingURL=phase.controller.js.map
