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
var phase_exports = {};
__export(phase_exports, {
  Phase: () => Phase,
  phaseSchema: () => phaseSchema
});
module.exports = __toCommonJS(phase_exports);
var import_mongoose = require("mongoose");
const phaseSchema = new import_mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  previousId: {
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Phase"
  },
  nextId: {
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Phase"
  },
  tasks: [{
    type: import_mongoose.Schema.Types.ObjectId,
    ref: "Task",
    default: []
  }],
  createdBy: String,
  updatedBy: String
}, { timestamps: true });
const Phase = (0, import_mongoose.model)("Phase", phaseSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Phase,
  phaseSchema
});
//# sourceMappingURL=phase.js.map
