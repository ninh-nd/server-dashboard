import { Request, Response } from "express";
import { Artifact } from "models/artifact";

export async function getAll(req: Request, res: Response) {
  const { projectName } = req.query;
  try {
    const artifacts = await Artifact.find({ projectName });
    return res.json(artifacts);
  } catch (error) {
    return res.json(`Internal server error: ${error}`);
  }
}
