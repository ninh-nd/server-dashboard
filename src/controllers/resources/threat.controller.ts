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
export async function create(req: Request, res: Response) {
  const { data } = req.body;
  try {
    const threat = await Threat.findOne({ name: data.name });
    if (threat) {
      return res.json(errorResponse(`Threat already exists`));
    }
    const newThreat = new Threat(data);
    await newThreat.save();
    return res.json(successResponse(newThreat, "Threat created successfully"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
