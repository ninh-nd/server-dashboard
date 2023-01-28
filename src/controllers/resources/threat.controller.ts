import { Request, Response } from "express";
import { Threat } from "models/threat";
import { errorResponse, successResponse } from "utils/responseFormat";

export async function getAll(req: Request, res: Response) {
  try {
    const threats = await Threat.find();
    return res.json(successResponse(threats, "Threats retrieved successfully"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
