import { Request, Response } from "express";
import { ThirdPartyModel } from "../models/models";
import MyOctokit from "../octokit";
import { Gitlab } from "@gitbeaker/rest";
import { errorResponse, successResponse } from "../utils/responseFormat";
export async function getAll(req: Request, res: Response) {
  try {
    const thirdParties = await ThirdPartyModel.find();
    return res.json(successResponse(thirdParties, "Third parties found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const thirdParty = await ThirdPartyModel.findById(id);
    return res.json(successResponse(thirdParty, "Third party found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  const { data } = req.body;
  try {
    const newThirdParty = await ThirdPartyModel.create(data);
    return res.json(successResponse(newThirdParty, "Third party created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { data } = req.body;
  try {
    const updatedThirdParty = await ThirdPartyModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
    return res.json(successResponse(updatedThirdParty, "Third party updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const deletedThirdParty = await ThirdPartyModel.findByIdAndDelete(id);
    return res.json(successResponse(deletedThirdParty, "Third party deleted"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function getReposFromGithub(req: Request, res: Response) {
  const account = req.user;
  if (!account) {
    return res.json(errorResponse("You are not authenticated"));
  }
  try {
    const thirdParty = account.thirdParty.find((x) => x.name === "Github");
    if (!thirdParty) {
      return res.json(errorResponse("No Github account linked"));
    }
    const { username, accessToken } = thirdParty;
    if (!accessToken) {
      return res.json(errorResponse("No Github access token"));
    }
    const octokit = new MyOctokit({
      auth: accessToken,
    });
    const repos = await octokit.rest.repos.listForAuthenticatedUser({
      username,
      type: "owner",
    });
    const formattedRepos = repos.data.map(
      ({ html_url, visibility, owner, full_name }) => ({
        name: full_name,
        url: html_url,
        status: visibility,
        owner: owner.login,
      })
    );
    return res.json(successResponse(formattedRepos, "Github repos found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
export async function getReposFromGitlab(req: Request, res: Response) {
  const account = req.user;
  if (!account) {
    return res.json(errorResponse("You are not authenticated"));
  }
  try {
    const thirdParty = account.thirdParty.find((x) => x.name === "Gitlab");
    if (!thirdParty) {
      return res.json(errorResponse("No Gitlab account linked"));
    }
    const { username, accessToken } = thirdParty;
    if (!accessToken) {
      return res.json(errorResponse("No Gitlab access token"));
    }
    const api = new Gitlab({
      token: accessToken,
    });
    const repos = await api.Projects.all({
      owned: true,
      orderBy: "name",
      sort: "asc",
    });
    const formattedRepos = repos.map(
      ({ http_url_to_repo, visibility, owner, path_with_namespace }) => ({
        name: path_with_namespace,
        url: http_url_to_repo,
        status: visibility,
        owner: owner.name,
      })
    );
    return res.json(successResponse(formattedRepos, "Gitlab repos found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
