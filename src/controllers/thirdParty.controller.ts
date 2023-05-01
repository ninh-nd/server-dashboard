import { Request, Response } from "express";
import { ThirdPartyModel } from "models/models";
import { CallbackError, Document } from "mongoose";
import { errorResponse, successResponse } from "utils/responseFormat";
export async function getAll(req: Request, res: Response) {
  try {
    const thirdParties = await ThirdPartyModel.find();
    return res.json(successResponse(thirdParties, "Third parties found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const thirdParty = await ThirdPartyModel.findById(id);
    return res.json(successResponse(thirdParty, "Third party found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  try {
    const newThirdParty = new ThirdPartyModel(req.body);
    await newThirdParty.save();
    return res.json(successResponse(newThirdParty, "Third party created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { data } = req.body;
  try {
    const updatedThirdParty = await ThirdPartyModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
    return res.json(successResponse(updatedThirdParty, "Third party updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  ThirdPartyModel.findByIdAndDelete(
    id,
    (error: CallbackError, doc: Document) => {
      if (error) {
        return res.json(errorResponse(`Internal server error: ${error}`));
      }
      if (!doc) {
        return res.json(errorResponse("Third party not found"));
      }
      return res.json(successResponse(doc, "Third party deleted"));
    }
  );
}
