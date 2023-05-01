import { Request, Response } from "express";
import { ArtifactModel } from "models/models";
import { successResponse } from "utils/responseFormat";

export async function getAll(req: Request, res: Response) {
  const { projectName } = req.query;
  try {
    const artifacts = await ArtifactModel.find({ projectName }).populate({
      path: "threatList vulnerabilityList",
    });
    return res.json(
      successResponse(artifacts, "Artifacts fetched successfully")
    );
  } catch (error) {
    return res.json(`Internal server error: ${error}`);
  }
}
export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const artifact = await ArtifactModel.findById(id).populate({
      path: "threatList vulnerabilityList",
    });
    return res.json(successResponse(artifact, "Artifact fetched successfully"));
  } catch (error) {
    return res.json(`Internal server error: ${error}`);
  }
}
