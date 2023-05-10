import { Ref } from "@typegoose/typegoose";
import { Request, Response } from "express";
import { Octokit } from "octokit";
import {
  AccountModel,
  ActivityHistoryModel,
  ProjectModel,
  UserModel,
} from "../models/models";
import { Project } from "../models/project";
import redis from "../redis";
import { errorResponse, successResponse } from "../utils/responseFormat";
async function githubCacheValidation(
  owner: string | undefined,
  repo: string | undefined,
  accessToken: string | undefined,
  projectId: Ref<Project>
) {
  if (!owner || !repo || !accessToken) {
    return new Error("Missing owner, repo or access token");
  }
  const pullRequestCache = await redis.get(`github-pr-${repo}`);
  if (pullRequestCache) {
    return true;
  }
  const commitCache = await redis.get(`github-commit-${repo}`);
  if (commitCache) {
    return true;
  }
  const octokit = new Octokit({
    auth: accessToken,
  });
  let prData, commitData;
  try {
    prData = await octokit.rest.pulls.list({
      owner,
      repo,
      state: "all",
    });
    commitData = await octokit.rest.repos.listCommits({
      owner,
      repo,
    });
  } catch (error) {
    return new Error("Error retrieving PRs from Github API");
  }
  await redis.set(`github-pr-${repo}`, JSON.stringify(prData), "EX", 60);
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
  await redis.set(
    `github-commit-${repo}`,
    JSON.stringify(commitData),
    "EX",
    60
  );
  const processedCommitData = commitData.data.map(({ sha: id, commit }) => {
    const content = commit.message;
    const createdBy = commit.author?.name;
    const createdAt = commit.author?.date;
    return { id, action: "commit", content, createdAt, createdBy, projectId };
  });
  try {
    await ActivityHistoryModel.insertMany(
      [...processedPrData, ...processedCommitData],
      {
        ordered: false,
      }
    );
    // Add history to each user in the project
    const history = await ActivityHistoryModel.find({ projectId });
    const users = await UserModel.find({ projectIn: projectId });
    users.forEach(async (user) => {
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

export async function getActivityHistory(req: Request, res: Response) {
  const { projectName } = req.params;
  const { username } = req.query;
  try {
    const user = await AccountModel.findOne({ username });
    const project = await ProjectModel.findOne({ name: projectName });
    const accessToken = req.user?.thirdParty.find(
      (x) => x.name === "Github"
    )?.accessToken;
    if (project) {
      const { url, _id } = project;
      if (!url) {
        return res.json(errorResponse("Missing url of the repository"));
      }
      const urlObject = new URL(url);
      const owner = urlObject.pathname.split("/")[1];
      const repo = urlObject.pathname.split("/")[2];
      const result = await githubCacheValidation(owner, repo, accessToken, _id);
      if (result instanceof Error) {
        return res.json(
          errorResponse(`Error retrieving activity history: ${result.message}`)
        );
      }
      // Query by username
      if (user) {
        const actHist = await ActivityHistoryModel.find({
          projectId: _id,
          createdBy: user.thirdParty.find((x) => x.name === "Github")?.username,
        });
        return res.json(
          successResponse(actHist, "Successfully retrieved activity history")
        );
      }
      // Query all
      const actHist = await ActivityHistoryModel.find({
        projectId: _id,
      });
      return res.json(
        successResponse(actHist, "Successfully retrieved activity history")
      );
    }
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function getActivityHistoryByUsername(
  req: Request,
  res: Response
) {
  const { username, projectName } = req.params;
  try {
    const project = await ProjectModel.findOne({ name: projectName });
    if (!project) {
      return res.json(errorResponse("No project found"));
    }
    const user = await AccountModel.findOne({ username });
    if (!user) {
      return res.json(errorResponse("No user found"));
    }
    const actHist = await ActivityHistoryModel.find({
      createdBy: user.thirdParty.find((x) => x.name === "Github")?.username,
      projectId: project._id,
    });
    return res.json(
      successResponse(actHist, "Successfully retrieved activity history")
    );
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
