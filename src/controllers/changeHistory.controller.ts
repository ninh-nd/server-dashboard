import { Request, Response } from "express";
import { ChangeHistoryModel } from "../models/models";
import { errorResponse, successResponse } from "../utils/responseFormat";

export async function getChangeHistoryByObjectId(req: Request, res: Response) {
  const { objectId } = req.query;
  try {
    const list = await ChangeHistoryModel.find({ objectId });
    return res.json(
      successResponse(list, "Change history fetched successfully")
    );
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
