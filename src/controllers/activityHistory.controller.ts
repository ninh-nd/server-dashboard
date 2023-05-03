import { Ref } from "@typegoose/typegoose";
import { Request, Response } from "express";
import { Octokit } from "octokit";
import {
  AccountModel,
  ActivityHistoryModel,
  GithubConfigModel,
  ProjectModel,
  UserModel,
} from "../models/models";
import { Project } from "../models/project";
import redisClient from "../redisServer";
import { errorResponse, successResponse } from "../utils/responseFormat";
async function getGithubPull(
  owner: string,
  repo: string,
  accessToken: string,
  projectId: Ref<Project>
) {
  const cache = await redisClient.v4.get(`github-pr-${repo}`);
  if (cache) {
    return true;
  }
  const octokit = new Octokit({
    auth: accessToken,
  });
  let prData;
  try {
    prData = await octokit.rest.pulls.list({
      owner,
      repo,
      state: "all",
    });
  } catch (error) {
    return new Error("Error retrieving PRs from Github API");
  }
  await redisClient.v4.setEx(`github-pr-${repo}`, 60, JSON.stringify(prData));
  const processedPrData = prData.data.map(
    ({ id, title: content, created_at: createdAt, user }) => {
      const createdBy = user?.login;
      return {
        id,
        action: "pr",
        content,
        createdAt,
        createdBy,
        projectId,
      };
    }
  );
  try {
    await ActivityHistoryModel.insertMany([...processedPrData], {
      ordered: false,
    });
    // Add history to each user in the project
    const history = await ActivityHistoryModel.find({ projectId });
    const users = await UserModel.find({ projectIn: projectId });
    users.forEach(async (user) => {
      // Temporary solution as Github is the only third party
      const account = await AccountModel.findById(user.account);
      if (!account) {
        return new Error("Can't find account");
      }
      const thirdPartyUsername = account.thirdParty.find(
        (x) => x.name === "Github"
      )?.username;
      const userHistory = history.filter(
        ({ createdBy }) => createdBy === thirdPartyUsername
      );
      await UserModel.findByIdAndUpdate(
        user._id,
        { $addToSet: { activityHistory: userHistory } },
        { new: true }
      );
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function getGithubCommits(
  owner: string,
  repo: string,
  accessToken: string,
  projectId: Ref<Project>
) {
  const cache = await redisClient.v4.get(`github-commit-${repo}`);
  if (cache) {
    return true;
  }
  const octokit = new Octokit({
    auth: accessToken,
  });
  let commitData;
  try {
    commitData = await octokit.rest.repos.listCommits({
      owner,
      repo,
    });
  } catch (error) {
    return new Error("Error retrieving PRs from Github API");
  }
  await redisClient.v4.setEx(
    `github-commit-${repo}`,
    60,
    JSON.stringify(commitData)
  );
  const processedCommitData = commitData.data.map(({ sha: id, commit }) => {
    const content = commit.message;
    const createdBy = commit.author?.name;
    const createdAt = commit.author?.date;
    return { id, action: "commit", content, createdAt, createdBy, projectId };
  });
  try {
    await ActivityHistoryModel.insertMany([...processedCommitData], {
      ordered: false,
    });
    // Add history to each user in the project
    const history = await ActivityHistoryModel.find({ projectId });
    const users = await UserModel.find({ projectIn: projectId });
    users.forEach(async (user) => {
      // Temporary solution as Github is the only third party
      const account = await AccountModel.findById(user.account);
      if (!account) {
        return new Error("Can't find account");
      }
      const thirdPartyUsername = account.thirdParty.find(
        (x) => x.name === "Github"
      )?.username;
      const userHistory = history.filter(
        ({ createdBy }) => createdBy === thirdPartyUsername
      );
      await UserModel.findByIdAndUpdate(
        user._id,
        { $addToSet: { activityHistory: userHistory } },
        { new: true }
      );
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function getPRs(req: Request, res: Response) {
  const { projectName } = req.params;
  const githubConfig = await GithubConfigModel.findOne({ repo: projectName });
  if (!githubConfig) {
    return res.json(errorResponse("No github config found"));
  }
  const { accessToken, owner, repo, projectId } = githubConfig;
  const result = await getGithubPull(owner, repo, accessToken, projectId);
  if (result instanceof Error) {
    return res.json(errorResponse(`Error retrieving PRs: ${result.message}`));
  }
  try {
    const prs = await ActivityHistoryModel.find({ projectId, action: "pr" });
    const total = prs.length;
    const authorArray = prs.map((pr) => pr.createdBy);
    const uniqueAuthors = [...new Set(authorArray)];
    const individualContribution: Array<{ author: string; total: number }> = [];
    uniqueAuthors.forEach((author) => {
      const prOfAnAuthor = prs.filter((pr) => pr.createdBy === author);
      const totalOfAnAuthor = prOfAnAuthor.length;
      if (author) {
        individualContribution.push({ author, total: totalOfAnAuthor });
      }
    });
    const data = { total, contribution: individualContribution };
    return res.json(successResponse(data, "Successfully retrieved PRs"));
  } catch (error) {
    return res.json(errorResponse("Error retrieving PRs"));
  }
}

export async function getCommits(req: Request, res: Response) {
  const { projectName } = req.params;
  const githubConfig = await GithubConfigModel.findOne({ repo: projectName });
  if (!githubConfig) {
    return res.json(errorResponse("No github config found"));
  }
  const { accessToken, owner, repo, projectId } = githubConfig;
  const result = await getGithubCommits(owner, repo, accessToken, projectId);
  if (result instanceof Error) {
    return res.json(
      errorResponse(`Error retrieving commits: ${result.message}`)
    );
  }
  try {
    const commits = await ActivityHistoryModel.find({
      projectId,
      action: "commit",
    });
    const total = commits.length;
    const authorArray = commits.map((cm) => cm.createdBy);
    const uniqueAuthors = [...new Set(authorArray)];
    const individualContribution: Array<{ author: string; total: number }> = [];
    uniqueAuthors.forEach((author) => {
      const prOfAnAuthor = commits.filter((cm) => cm.createdBy === author);
      const totalOfAnAuthor = prOfAnAuthor.length;
      if (author) {
        individualContribution.push({ author, total: totalOfAnAuthor });
      }
    });
    const data = { total, contribution: individualContribution };
    return res.json(successResponse(data, "Successfully retrieved commits"));
  } catch (error) {
    return res.json(errorResponse("Error retrieving commits"));
  }
}

export async function getCommitsByAccount(req: Request, res: Response) {
  const { username, projectName } = req.params;
  try {
    const projectId = await ProjectModel.findOne({ name: projectName });
    if (!projectId) {
      return res.json(errorResponse("No project found"));
    }
    const user = await AccountModel.findOne({ username });
    if (!user) {
      return res.json(errorResponse("No user found"));
    }
    // Get the account linked to the internal account
    const commits = await ActivityHistoryModel.find({
      createdBy: user.thirdParty.find((x) => x.name === "Github")?.username,
      action: "commit",
      projectId,
    });
    const result = { total: commits.length, commits };
    return res.json(successResponse(result, "Successfully retrieved commits"));
  } catch (error) {
    return res.json(errorResponse("Error retrieving commits"));
  }
}

export async function getPRsByAccount(req: Request, res: Response) {
  const { username, projectName } = req.params;
  try {
    const projectId = await ProjectModel.findOne({ name: projectName });
    if (!projectId) {
      return res.json(errorResponse("No project found"));
    }
    const user = await AccountModel.findOne({ username });
    if (!user) {
      return res.json(errorResponse("No user found"));
    }
    // Get the account linked to the internal account
    const prs = await ActivityHistoryModel.find({
      createdBy: user.thirdParty.find((x) => x.name === "Github")?.username,
      action: "pr",
      projectId,
    });
    const result = { total: prs.length, prs };
    return res.json(successResponse(result, "Successfully retrieved PRs"));
  } catch (error) {
    return res.json(errorResponse("Error retrieving PRs"));
  }
}
