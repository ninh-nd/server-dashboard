import mongoose from "mongoose";
import { GithubConfig } from "models/githubConfig";
import { errorResponse, successResponse } from "utils/responseFormat";
import { Request, Response } from "express";
import { Octokit } from "octokit";
export async function get(req: Request, res: Response) {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.json(errorResponse("Invalid project id"));
  }
  try {
    const githubConfig = await GithubConfig.findOne({ projectId });
    if (githubConfig != null) {
      return res.json(successResponse(githubConfig, "Github config found"));
    }
    return res.json(errorResponse("No Github config found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  const githubConfig = new GithubConfig(req.body);
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
    const githubConfig = await GithubConfig.findOneAndUpdate(
      { projectId },
      req.body,

      { new: true }
    );
    if (githubConfig != null) {
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
