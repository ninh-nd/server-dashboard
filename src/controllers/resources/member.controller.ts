import { Member } from "models/member";
import { errorResponse, successResponse } from "utils/responseFormat";
import { Request, Response } from "express";
import { CallbackError, Document } from "mongoose";
export async function get(req: Request, res: Response) {
  try {
    const member = await Member.findById(req.params.id).populate(
      "activityHistory"
    );
    return res.json(successResponse(member, "Member found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  try {
    const member = await Member.create(req.body);
    return res.json(successResponse(member, "Member created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(successResponse(member, "Member updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  Member.findByIdAndDelete(
    req.params.id,
    (error: CallbackError, doc: Document) => {
      if (error != null) {
        return res.json(errorResponse(`Internal server error: ${error}`));
      }
      if (!doc) {
        return res.json(errorResponse("Member not found"));
      }
      return res.json(successResponse(doc, "Member deleted"));
    }
  );
}

export async function assignTask(req: Request, res: Response) {
  try {
    // Check if task has already been assigned
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { taskAssigned: req.body.taskId } },

      { new: true }
    );
    return res.json(successResponse(member, "Task assigned"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function joinProject(req: Request, res: Response) {
  try {
    // Check if project has already been added
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { projectParticipated: req.body.projectId } },
      { new: true }
    );
    return res.json(successResponse(member, "Project joined"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
