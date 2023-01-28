import { ProjectManager } from "models/projectManager";
import { errorResponse, successResponse } from "utils/responseFormat";
import { Request, Response } from "express";
import { CallbackError, Document } from "mongoose";
import { IAccount } from "models/interfaces";
import getRole from "utils/account";
export async function get(req: Request, res: Response) {
  try {
    const pm = await ProjectManager.findById(req.params.id);
    return res.json(successResponse(pm, "Project Manager found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  try {
    const pm = await ProjectManager.create(req.body);
    return res.json(successResponse(pm, "Project Manager created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  try {
    const pm = await ProjectManager.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(successResponse(pm, "Project Manager updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  ProjectManager.findByIdAndDelete(
    req.params.id,
    (error: CallbackError, doc: Document) => {
      if (error != null) {
        return res.json(errorResponse(`Internal server error: ${error}`));
      }
      if (!doc) {
        return res.json(errorResponse("Project Manager not found"));
      }
      return res.json(successResponse(doc, "Project Manager deleted"));
    }
  );
}

export async function addProjectOwn(req: Request, res: Response) {
  try {
    const pm = await ProjectManager.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { projectOwn: req.body.projectId } },
      { new: true }
    );
    return res.json(successResponse(pm, "Project added to Project Manager"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function getProjectOwn(req: Request, res: Response) {
  try {
    const account = req.user as IAccount;
    const roleObject = await getRole(account._id);
    if (roleObject === undefined) return;
    const { id } = roleObject;
    const pm = await ProjectManager.findById(id).populate("projectOwn");
    if (pm == null) {
      return res.json(errorResponse("Project Manager not found"));
    }
    const data = pm.projectOwn;
    return res.json(successResponse(data, ""));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
