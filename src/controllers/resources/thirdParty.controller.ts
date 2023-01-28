import { ThirdParty } from "models/thirdParty";
import { errorResponse, successResponse } from "utils/responseFormat";
import { Request, Response } from "express";
import { CallbackError, Document } from "mongoose";
export async function getAll(req: Request, res: Response) {
  try {
    const thirdParties = await ThirdParty.find();
    return res.json(successResponse(thirdParties, "Third parties found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function get(req: Request, res: Response) {
  try {
    const thirdParty = await ThirdParty.findById(req.params.id);
    return res.json(successResponse(thirdParty, "Third party found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  try {
    const newThirdParty = new ThirdParty(req.body);
    await newThirdParty.save();
    return res.json(successResponse(newThirdParty, "Third party created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  try {
    const updatedThirdParty = await ThirdParty.findByIdAndUpdate(
      req.params.id,
      req.body,

      { new: true }
    );
    return res.json(successResponse(updatedThirdParty, "Third party updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  ThirdParty.findByIdAndDelete(
    req.params.id,
    (error: CallbackError, doc: Document) => {
      if (error != null) {
        return res.json(errorResponse(`Internal server error: ${error}`));
      }
      if (!doc) {
        return res.json(errorResponse("Third party not found"));
      }
      return res.json(successResponse(doc, "Third party deleted"));
    }
  );
}
