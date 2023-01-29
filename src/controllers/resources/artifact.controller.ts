import { Request, Response } from "express";
import { Artifact } from "models/artifact";
import { successResponse } from "utils/responseFormat";

export async function getAll(req: Request, res: Response) {
  const { projectName } = req.query;
  try {
    const artifacts = await Artifact.find({ projectName });
    return res.json(
      successResponse(artifacts, "Artifacts fetched successfully")
    );
  } catch (error) {
    return res.json(`Internal server error: ${error}`);
  }
}
export async function get(req: Request, res: Response) {
  try {
    const artifact = await Artifact.findById(req.params.id).populate({
      path: "threatList vulnerabilityList",
    });
    return res.json(successResponse(artifact, "Artifact fetched successfully"));
  } catch (error) {
    return res.json(`Internal server error: ${error}`);
  }
}
