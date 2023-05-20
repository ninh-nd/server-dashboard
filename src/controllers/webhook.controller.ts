import { Request, Response } from "express";
import { ArtifactModel } from "../models/models";
import { errorResponse } from "../utils/responseFormat";
import { Octokit } from "octokit";
export async function importVulnToImage(req: Request, res: Response) {
  const { eventCode, imageName, data } = req.body;
  try {
    // imageName is either in format of {image}:{tag} or {author}/{image}:{tag}. Retrieve the image and tag from it
    const name = imageName.split(":")[0];
    const version = imageName.split(":")[1];
    const artifacts = await ArtifactModel.find({
      name,
      version,
    });
    if (!artifacts) {
      return res.json(
        errorResponse(
          `No artifact found with name ${name} and version ${version}`
        )
      );
    }
    await ArtifactModel.updateMany(
      { name, version },
      {
        $set: {
          vulnerabilitiesList: data,
        },
      }
    );
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function triggerGithubScan(req: Request, res: Response) {
  const { accessToken, url } = req.body;
  const [owner, repo] = url.split("/").slice(-2);
  const octokit = new Octokit({
    auth: accessToken,
  });
}

export async function receiveGithubScanResult(req: Request, res: Response) {}
