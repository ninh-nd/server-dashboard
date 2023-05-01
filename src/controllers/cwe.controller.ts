import { Request, Response } from "express";
import { CWEModel } from "models/models";
import { errorResponse, successResponse } from "utils/responseFormat";

export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const cwe = await CWEModel.findOne({ cweId: id });
    if (!cwe)
      return res.json(errorResponse("CWE is not found in the database"));
    return res.json(successResponse(cwe, "CWE found"));
  } catch (error) {
    return res.json(`Internal server error: ${error}`);
  }
}
