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
var account_controller_exports = {};
__export(account_controller_exports, {
  addThirdPartyToAccount: () => addThirdPartyToAccount,
  changePassword: () => changePassword,
  create: () => create,
  get: () => get,
  login: () => login
});
module.exports = __toCommonJS(account_controller_exports);
var import_config = require("dotenv/config");
var import_bcrypt = __toESM(require("bcrypt"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_member = require("../../models/member");
var import_projectManager = require("../../models/projectManager");
var import_account = require("../../models/account");
var import_responseFormat = require("../../utils/responseFormat");
var import_thirdParty = require("../../models/thirdParty");
async function getRole(accountId) {
  const member = await import_member.Member.findOne({ account: accountId });
  const projectManager = await import_projectManager.ProjectManager.findOne({ account: accountId });
  if (member != null) {
    return {
      role: "member",
      id: member._id
    };
  }
  if (projectManager != null) {
    return {
      role: "projectManager",
      id: projectManager._id
    };
  }
  return null;
}
async function get(req, res) {
  try {
    const account = await import_account.Account.findById(req.params.id);
    return res.status(200).json((0, import_responseFormat.successResponse)(account, "Account found"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function create(req, res) {
  const { username, password, email } = req.body;
  const accountExists = await import_account.Account.findOne({ username });
  if (accountExists != null) {
    return res.status(409).json((0, import_responseFormat.errorResponse)("Username already exists"));
  }
  const hashedPassword = await import_bcrypt.default.hash(password, 10);
  try {
    const newAccount = new import_account.Account({
      username,
      password: hashedPassword,
      email
    });
    await newAccount.save();
    return res.status(201).json((0, import_responseFormat.successResponse)(newAccount, "Account created"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function login(req, res) {
  const { username, password } = req.body;
  const account = await import_account.Account.findOne({ username });
  if (account == null) {
    return res.status(404).json((0, import_responseFormat.errorResponse)("Username not found"));
  }
  try {
    const { _id: accountId } = account;
    const result = await import_bcrypt.default.compare(password, account.password);
    if (result) {
      if (process.env.ACCESS_TOKEN_SECRET === void 0 || process.env.REFRESH_TOKEN_SECRET === void 0) {
        return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
      }
      const accessToken = import_jsonwebtoken.default.sign({ accountId }, process.env.ACCESS_TOKEN_SECRET);
      const refreshToken = import_jsonwebtoken.default.sign({ accountId }, process.env.REFRESH_TOKEN_SECRET);
      const roleObject = await getRole(accountId);
      if (roleObject === null) {
        return res.status(500).json((0, import_responseFormat.errorResponse)("Cannot find role"));
      }
      const { role, id } = roleObject;
      const data = {
        role,
        id,
        username,
        accessToken,
        refreshToken
      };
      return res.status(201).json((0, import_responseFormat.successResponse)(data, "Login successful"));
    }
    return res.status(401).json((0, import_responseFormat.errorResponse)("Incorrect password"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function addThirdPartyToAccount(req, res) {
  const account = await import_account.Account.findById(req.params.id);
  if (account == null) {
    return res.status(404).json((0, import_responseFormat.errorResponse)("Account not found"));
  }
  try {
    const { name, username, url } = req.body;
    const newThirdParty = new import_thirdParty.ThirdParty({
      name,
      username,
      url
    });
    account.thirdParty.push(newThirdParty);
    await account.save();
    return res.status(200).json((0, import_responseFormat.successResponse)(account, "Third party account added"));
  } catch (error) {
    return res.status(500).json((0, import_responseFormat.errorResponse)("Internal server error"));
  }
}
async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json((0, import_responseFormat.errorResponse)("Missing old or new password"));
  }
  const account = await import_account.Account.findById(req.params.id);
  if (account == null) {
    return res.status(404).json((0, import_responseFormat.errorResponse)("Account not found"));
  }
  const isMatch = await import_bcrypt.default.compare(oldPassword, account.password);
  if (!isMatch) {
    return res.status(400).json((0, import_responseFormat.errorResponse)("Incorrect old password"));
  }
  const hashedPassword = await import_bcrypt.default.hash(newPassword, 10);
  account.password = hashedPassword;
  await account.save();
  return res.status(200).json((0, import_responseFormat.successResponse)(account, "Password changed"));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addThirdPartyToAccount,
  changePassword,
  create,
  get,
  login
});
//# sourceMappingURL=account.controller.js.map
