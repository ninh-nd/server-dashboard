import { Request, Response } from "express";
import { UserModel } from "models/models";
import { CallbackError, Document } from "mongoose";
import { errorResponse, successResponse } from "utils/responseFormat";
export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id).populate({
      path: "activityHistory taskAssigned ticketAssigned account",
    });
    return res.json(successResponse(user, "User found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  try {
    const user = await UserModel.create(req.body);
    return res.json(successResponse(user, "User created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.json(successResponse(user, "User updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  UserModel.findByIdAndDelete(id, (error: CallbackError, doc: Document) => {
    if (error) {
      return res.json(errorResponse(`Internal server error: ${error}`));
    }
    if (!doc) {
      return res.json(errorResponse("User not found"));
    }
    return res.json(successResponse(doc, "User deleted"));
  });
}

export async function assignTask(req: Request, res: Response) {
  const { id, taskId } = req.params;
  try {
    // Check if task has already been assigned
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $addToSet: { taskAssigned: taskId } },

      { new: true }
    );
    return res.json(successResponse(user, "Task assigned"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function addProjectIn(req: Request, res: Response) {
  const { id } = req.params;
  const { projectId } = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $addToSet: { projectIn: projectId } },
      { new: true }
    );
    return res.json(successResponse(user, "Project added to user"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function getProjectIn(req: Request, res: Response) {
  const account = req.user;
  const id = account._id;
  try {
    const user = await UserModel.findOne({ account: id }).populate("projectIn");
    if (!user) {
      return res.json(errorResponse("User not found"));
    }
    const data = user.projectIn;
    return res.json(successResponse(data, "List of projects fetched"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
