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
var activityHistory_exports = {};
__export(activityHistory_exports, {
  default: () => activityHistory_default
});
module.exports = __toCommonJS(activityHistory_exports);
var import_express = __toESM(require("express"));
var import_activityHistory = require("../../controllers/resources/activityHistory.controller");
const router = import_express.default.Router();
router.get("/:projectName/commit", import_activityHistory.getCommits);
router.get("/:projectName/pullrequest", import_activityHistory.getPRs);
router.get("/:projectName/commit/:username", import_activityHistory.getCommitsByAccount);
router.get("/:projectName/pullrequest/:username", import_activityHistory.getPRsByAccount);
var activityHistory_default = router;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=activityHistory.js.map
