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
var task_controller_exports = {};
__export(task_controller_exports, {
  create: () => create,
  get: () => get,
  getAll: () => getAll,
  remove: () => remove,
  update: () => update
});
module.exports = __toCommonJS(task_controller_exports);
var import_task = require("../../models/task");
var import_responseFormat = require("../../utils/responseFormat");
async function getAll(req, res) {
  try {
    const tasks = await import_task.Task.find();
    return res.status(200).json((0, import_responseFormat.successResponse)(tasks, "Tasks found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function get(req, res) {
  try {
    const task = await import_task.Task.findById(req.params.id);
    return res.status(200).json((0, import_responseFormat.successResponse)(task, "Task found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function create(req, res) {
  try {
    const newTask = new import_task.Task(req.body);
    await newTask.save();
    return res.status(201).json((0, import_responseFormat.successResponse)(newTask, "Task created"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function update(req, res) {
  try {
    const updatedTask = await import_task.Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json((0, import_responseFormat.successResponse)(updatedTask, "Task updated"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function remove(req, res) {
  import_task.Task.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err != null) {
      return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
    }
    if (!doc) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("Task not found"));
    }
    return res.status(200).json((0, import_responseFormat.successResponse)(doc, "Task deleted"));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  create,
  get,
  getAll,
  remove,
  update
});
//# sourceMappingURL=task.controller.js.map
