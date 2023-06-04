import { Request, Response } from "express";
import { ThreatModel } from "../models/models";
import { errorResponse, successResponse } from "../utils/responseFormat";

export async function getAll(req: Request, res: Response) {
  try {
    const threats = await ThreatModel.find();
    return res.json(successResponse(threats, "Threats retrieved successfully"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
export async function create(req: Request, res: Response) {
  const { data } = req.body;
  try {
    const threat = await ThreatModel.findOne({ name: data.name });
    if (threat) {
      return res.json(errorResponse(`Threat already exists`));
    }
    const newThreat = await ThreatModel.create(data);
    return res.json(
      successResponse(
        null,
        "Registered a new threat successfully. Threat is now available in the database"
      )
    );
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const threat = await ThreatModel.findById(id);
    if (!threat) {
      return res.json(errorResponse(`Threat not found`));
    }
    return res.json(successResponse(threat, "Threat retrieved successfully"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
