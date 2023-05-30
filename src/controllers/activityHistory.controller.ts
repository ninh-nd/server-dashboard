import { Ref } from "@typegoose/typegoose";
import { Request, Response } from "express";
import {
  AccountModel,
  ActivityHistoryModel,
  ProjectModel,
  UserModel,
} from "../models/models";
import { Project } from "../models/project";
import MyOctokit, { MyOctokitType } from "../octokit";
import redis from "../redis";
import { errorResponse, successResponse } from "../utils/responseFormat";
async function getPullRequests(
  octokit: MyOctokitType,
  owner: string,
  repo: string,
  projectId: Ref<Project>
) {
  try {
    const prData = [];
    for await (const response of octokit.paginate.iterator(
      octokit.rest.pulls.list,
      {
        owner,
        repo,
        per_page: 100,
        state: "all",
      }
    )) {
      prData.push(response.data);
    }
    const processedPrData = prData
      .flat()
      .map(({ id, title: content, created_at: createdAt, user }) => {
        const createdBy = user?.login;
        return {
          id,
          action: "pr",
          content,
          createdAt,
          createdBy,
          projectId,
        };
      });
    return processedPrData;
  } catch (error) {
    console.log(error);
    return [];
  }
}
async function getCommits(
  octokit: MyOctokitType,
  owner: string,
  repo: string,
  projectId: Ref<Project>
) {
  try {
    const commits = [];
    for await (const response of octokit.paginate.iterator(
      octokit.rest.repos.listCommits,
      {
        owner,
        repo,
        per_page: 100,
      }
    )) {
      commits.push(response.data);
    }
    const processedCommitData = commits.flat().map(({ sha: id, commit }) => {
      const content = commit.message;
      const createdBy = commit.author?.name;
      const createdAt = commit.author?.date;
      return {
        id,
        action: "commit",
        content,
        createdAt,
        createdBy,
        projectId,
      };
    });
    return processedCommitData;
  } catch (error) {
    console.log(error);
    return [];
  }
}
async function fetchLatestFromGithub(
  owner: string | undefined,
  repo: string | undefined,
  accessToken: string | undefined,
  projectId: Ref<Project>
) {
  if (!owner || !repo || !accessToken) {
    return new Error("Missing owner, repo or access token");
  }
  const cache = await redis.get(`github-${repo}`);
  if (cache) {
    return true;
  }
  const octokit = new MyOctokit({
    auth: accessToken,
  });
  redis.set(`github-${repo}`, Date.now().toString(), "EX", 60);
  const processedPrData = await getPullRequests(
    octokit,
    owner,
    repo,
    projectId
  );
  const processedCommitData = await getCommits(octokit, owner, repo, projectId);
  if (!processedPrData || !processedCommitData) {
    return new Error("Error fetching data from Github");
  }
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
      const result = await fetchLatestFromGithub(owner, repo, accessToken, _id);
      if (result instanceof Error) {
        return res.json(
          errorResponse(
            `Error updating latest activity history: ${result.message}`
          )
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
