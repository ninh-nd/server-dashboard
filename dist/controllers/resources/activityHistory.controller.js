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
var activityHistory_controller_exports = {};
__export(activityHistory_controller_exports, {
  getCommits: () => getCommits,
  getCommitsByAccount: () => getCommitsByAccount,
  getPRs: () => getPRs,
  getPRsByAccount: () => getPRsByAccount
});
module.exports = __toCommonJS(activityHistory_controller_exports);
var import_octokit = require("octokit");
var import_account = require("../../models/account");
var import_activityHistory = require("../../models/activityHistory");
var import_member = require("../../models/member");
var import_githubConfig = require("../../models/githubConfig");
var import_project = require("../../models/project");
var import_responseFormat = require("../../utils/responseFormat");
var import_redis = require("../../redis");
async function getGithubPull(owner, repo, accessToken, projectId) {
  const cache = await import_redis.redisClient.get(`github-pr-${repo}`);
  if (cache) {
    return true;
  }
  const octokit = new import_octokit.Octokit({
    auth: accessToken
  });
  const prData = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "all"
  });
  await import_redis.redisClient.setEx(`github-pr-${repo}`, import_redis.DEFAULT_TTL, JSON.stringify(prData));
  const processedPrData = prData.data.map(({
    id,
    title: content,
    created_at: createdAt,
    user: { login: createdBy }
  }) => ({
    id,
    action: "pr",
    content,
    createdAt,
    createdBy,
    projectId
  }));
  try {
    await import_activityHistory.ActivityHistory.insertMany(
      [...processedPrData],
      { ordered: false }
    );
    const history = await import_activityHistory.ActivityHistory.find({ projectId });
    const members = await import_member.Member.find({ projectIn: projectId });
    members.forEach(async (member) => {
      const account = await import_account.Account.findById(member.account);
      if (account == null) {
        return new Error("Can't find account");
      }
      const thirdPartyUsername = account.thirdParty[0].username;
      const memberHistory = history.filter(
        ({ createdBy }) => createdBy === thirdPartyUsername
      );
      await import_member.Member.findByIdAndUpdate(
        member._id,
        { $addToSet: { activityHistory: memberHistory } },
        { new: true }
      );
    });
    return true;
  } catch (error) {
    return new Error("Error retrieving PRs from Github API");
  }
}
async function getGithubCommits(owner, repo, accessToken, projectId) {
  const cache = await import_redis.redisClient.get(`github-commit-${repo}`);
  if (cache) {
    return true;
  }
  const octokit = new import_octokit.Octokit({
    auth: accessToken
  });
  const commitData = await octokit.rest.repos.listCommits({
    owner,
    repo
  });
  await import_redis.redisClient.setEx(`github-commit-${repo}`, import_redis.DEFAULT_TTL, JSON.stringify(commitData));
  const processedCommitData = commitData.data.map(({
    sha: id,
    commit: { message: content, author: { name: createdBy, date: createdAt } }
  }) => ({
    id,
    action: "commit",
    content,
    createdAt,
    createdBy,
    projectId
  }));
  try {
    await import_activityHistory.ActivityHistory.insertMany(
      [...processedCommitData],
      { ordered: false }
    );
    const history = await import_activityHistory.ActivityHistory.find({ projectId });
    const members = await import_member.Member.find({ projectIn: projectId });
    members.forEach(async (member) => {
      const account = await import_account.Account.findById(member.account);
      if (account == null) {
        return new Error("Can't find account");
      }
      const thirdPartyUsername = account.thirdParty[0].username;
      const memberHistory = history.filter(
        ({ createdBy }) => createdBy === thirdPartyUsername
      );
      await import_member.Member.findByIdAndUpdate(
        member._id,
        { $addToSet: { activityHistory: memberHistory } },
        { new: true }
      );
    });
    return true;
  } catch (error) {
    return new Error("Error retrieving commits from Github API");
  }
}
async function getPRs(req, res) {
  const { projectName } = req.params;
  const githubConfig = await import_githubConfig.GithubConfig.findOne({ name: projectName }).populate("projectId");
  if (githubConfig == null) {
    return res.status(404).json((0, import_responseFormat.errorResponse)("No github config found"));
  }
  const {
    accessToken,
    owner,
    repo,
    projectId
  } = githubConfig;
  const result = await getGithubPull(owner, repo, accessToken, projectId);
  if (result instanceof Error) {
    return res.json((0, import_responseFormat.errorResponse)(`Error retrieving PRs: ${result.message}`));
  }
  try {
    const prs = await import_activityHistory.ActivityHistory.find({ projectId, action: "pr" });
    const total = prs.length;
    const authorArray = prs.map((pr) => pr.createdBy);
    const uniqueAuthors = [...new Set(authorArray)];
    const individualContribution = [];
    uniqueAuthors.forEach((author) => {
      const prOfAnAuthor = prs.filter((pr) => pr.createdBy === author);
      const totalOfAnAuthor = prOfAnAuthor.length;
      if (author) {
        individualContribution.push({ author, total: totalOfAnAuthor });
      }
    });
    const data = { total, contribution: individualContribution };
    return res.status(200).json((0, import_responseFormat.successResponse)(data, "Successfully retrieved PRs"));
  } catch (error) {
    return res.json((0, import_responseFormat.errorResponse)("Error retrieving PRs"));
  }
}
async function getCommits(req, res) {
  const { projectName } = req.params;
  const githubConfig = await import_githubConfig.GithubConfig.findOne({ name: projectName }).populate("projectId");
  if (githubConfig == null) {
    return res.status(404).json((0, import_responseFormat.errorResponse)("No github config found"));
  }
  const {
    accessToken,
    owner,
    repo,
    projectId
  } = githubConfig;
  const result = await getGithubCommits(owner, repo, accessToken, projectId);
  if (result instanceof Error) {
    return res.json((0, import_responseFormat.errorResponse)(`Error retrieving commits: ${result.message}`));
  }
  try {
    const commits = await import_activityHistory.ActivityHistory.find({ projectId, action: "commit" });
    const total = commits.length;
    const authorArray = commits.map((cm) => cm.createdBy);
    const uniqueAuthors = [...new Set(authorArray)];
    const individualContribution = [];
    uniqueAuthors.forEach((author) => {
      const prOfAnAuthor = commits.filter((cm) => cm.createdBy === author);
      const totalOfAnAuthor = prOfAnAuthor.length;
      if (author) {
        individualContribution.push({ author, total: totalOfAnAuthor });
      }
    });
    const data = { total, contribution: individualContribution };
    return res.status(200).json((0, import_responseFormat.successResponse)(data, "Successfully retrieved commits"));
  } catch (error) {
    return res.json((0, import_responseFormat.errorResponse)("Error retrieving commits"));
  }
}
async function getCommitsByAccount(req, res) {
  const { username, projectName } = req.params;
  try {
    const projectId = await import_project.Project.findOne({ name: projectName });
    if (projectId == null) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("No project found"));
    }
    const user = await import_account.Account.findOne({ username });
    if (user == null) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("No user found"));
    }
    const commits = await import_activityHistory.ActivityHistory.find({ createdBy: user.thirdParty[0].username, action: "commit", projectId });
    const result = { total: commits.length, commits };
    return res.status(200).json((0, import_responseFormat.successResponse)(result, "Successfully retrieved commits"));
  } catch (error) {
    return res.json((0, import_responseFormat.errorResponse)("Error retrieving commits"));
  }
}
async function getPRsByAccount(req, res) {
  const { username, projectName } = req.params;
  try {
    const projectId = await import_project.Project.findOne({ name: projectName });
    if (projectId == null) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("No project found"));
    }
    const user = await import_account.Account.findOne({ username });
    if (user == null) {
      return res.status(404).json((0, import_responseFormat.errorResponse)("No user found"));
    }
    const prs = await import_activityHistory.ActivityHistory.find({ createdBy: user.thirdParty[0].username, action: "pr", projectId });
    const result = { total: prs.length, prs };
    return res.status(200).json((0, import_responseFormat.successResponse)(result, "Successfully retrieved PRs"));
  } catch (error) {
    return res.json((0, import_responseFormat.errorResponse)("Error retrieving PRs"));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCommits,
  getCommitsByAccount,
  getPRs,
  getPRsByAccount
});
//# sourceMappingURL=activityHistory.controller.js.map
