import { Request, Response } from "express";
import { ArtifactModel, ProjectModel } from "models/models";
import { errorResponse, successResponse } from "utils/responseFormat";

export async function getAll(req: Request, res: Response) {
  const { projectName } = req.query;
  // Find all artifacts
  try {
    if (typeof projectName === "string") {
      const project = await ProjectModel.findOne({
        name: projectName,
      }).populate({
        path: "phaseList",
        populate: {
          path: "artifacts",
        },
      });
      if (!project) {
        return res.json(errorResponse("Project not found"));
      }
      const artifacts = project.phaseList
        .map((phase) => phase.artifacts)
        .flat();
      return res.json(
        successResponse(
          artifacts,
          "Get all artifacts with respective vulnerabilities"
        )
      );
    }
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const artifact = await ArtifactModel.findById(id);
    return res.json(successResponse(artifact, "Artifact fetched successfully"));
  } catch (error) {
    return res.json(`Internal server error: ${error}`);
  }
}
