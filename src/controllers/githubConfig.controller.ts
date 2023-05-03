import { Request, Response } from "express";
import { GithubConfigModel } from "~/models/models";
import mongoose from "mongoose";
import { Octokit } from "octokit";
import { errorResponse, successResponse } from "~/utils/responseFormat";
export async function get(req: Request, res: Response) {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.json(errorResponse("Invalid project id"));
  }
  try {
    const githubConfig = await GithubConfigModel.findOne({ projectId });
    if (githubConfig) {
      return res.json(successResponse(githubConfig, "Github config found"));
    }
    return res.json(errorResponse("No Github config found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  const githubConfig = new GithubConfigModel(req.body);
  try {
    const newGithubConfig = await githubConfig.save();
    return res.json(successResponse(newGithubConfig, "Github config created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  const { projectId } = req.params;
  try {
    const githubConfig = await GithubConfigModel.findOneAndUpdate(
      { projectId },
      req.body,

      { new: true }
    );
    if (githubConfig) {
      return res.json(successResponse(githubConfig, "Github config updated"));
    }
    return res.json(errorResponse("No Github config found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function getProjects(req: Request, res: Response) {
  const { username, accessToken } = req.query;
  const forceUsername = username as string;
  const octokit = new Octokit({
    auth: accessToken,
  });
  try {
    const projects = await octokit.rest.repos.listForUser({
      username: forceUsername,
      type: "owner",
    });
    const { data } = projects;
    if (data.length === 0) {
      return res.json(
        errorResponse("No Github projects found on this account")
      );
    }
    const response = data.map(({ name, html_url }) => ({
      name,
      url: html_url,
    }));
    return res.json(successResponse(response, "Github projects found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
