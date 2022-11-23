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
var thirdParty_controller_exports = {};
__export(thirdParty_controller_exports, {
  create: () => create,
  get: () => get,
  getAll: () => getAll,
  remove: () => remove,
  update: () => update
});
module.exports = __toCommonJS(thirdParty_controller_exports);
var import_thirdParty = require("../../models/thirdParty");
var import_responseFormat = require("../../utils/responseFormat");
async function getAll(req, res) {
  try {
    const thirdParties = await import_thirdParty.ThirdParty.find();
    return res.status(200).json((0, import_responseFormat.successResponse)(thirdParties, "Third parties found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function get(req, res) {
  try {
    const thirdParty = await import_thirdParty.ThirdParty.findById(req.params.id);
    return res.status(200).json((0, import_responseFormat.successResponse)(thirdParty, "Third party found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function create(req, res) {
  try {
    const newThirdParty = new import_thirdParty.ThirdParty(req.body);
    await newThirdParty.save();
    return res.status(201).json((0, import_responseFormat.successResponse)(newThirdParty, "Third party created"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function update(req, res) {
  try {
    const updatedThirdParty = await import_thirdParty.ThirdParty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json((0, import_responseFormat.successResponse)(updatedThirdParty, "Third party updated"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function remove(req, res) {
  import_thirdParty.ThirdParty.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err != null) {
      return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
    }
    if (!doc) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("Third party not found"));
    }
    return res.status(200).json((0, import_responseFormat.successResponse)(doc, "Third party deleted"));
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
//# sourceMappingURL=thirdParty.controller.js.map
