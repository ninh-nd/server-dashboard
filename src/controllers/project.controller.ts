import { Request, Response } from "express";
import { PhaseModel, ProjectModel, UserModel } from "~/models/models";
import { Phase } from "~/models/phase";
import { errorResponse, successResponse } from "~/utils/responseFormat";
export async function get(req: Request, res: Response) {
  try {
    const { projectName } = req.params;
    const project = await ProjectModel.findOne({ name: projectName }).populate({
      path: "phaseList",
      options: {
        sort: {
          order: 1,
        },
      },
      populate: [
        {
          path: "tasks",
        },
        {
          path: "artifacts",
          populate: {
            path: "threatList vulnerabilityList",
          },
        },
      ],
    });
    return res.json(successResponse(project, "Project found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  try {
    const project = await ProjectModel.create(req.body);
    return res.json(successResponse(project, "Project created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const { projectName } = req.params;
    const { status } = req.body;
    const project = await ProjectModel.findOneAndUpdate(
      { name: projectName },
      { status },

      { new: true }
    );
    return res.json(successResponse(project, "Project status updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function addPhaseToProject(req: Request, res: Response) {
  try {
    const { projectName } = req.params;
    const { phaseId } = req.body;
    const project = await ProjectModel.findOneAndUpdate(
      { name: projectName },
      {
        $addToSet: {
          phaseList: phaseId,
        },
      },
      { new: true }
    );
    return res.json(successResponse(project, "Phase added to project"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  const { projectName } = req.params;
  const { id } = req.params;
  try {
    const project = await ProjectModel.findOne({ name: projectName });
    if (!project) {
      return res.json(errorResponse("Project not found"));
    }
    await ProjectModel.findByIdAndDelete(id);
    return res.json(successResponse(project, "Project deleted"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function getProjectMembers(req: Request, res: Response) {
  try {
    const { projectName } = req.params;
    const project = await ProjectModel.findOne({ name: projectName });
    if (!project) {
      return res.json(errorResponse("Project not found"));
    }
    const users = await UserModel.find({ projectIn: project._id })
      .populate({
        path: "activityHistory",
        match: { projectId: project._id },
      })
      .populate({
        path: "taskAssigned",
        match: { projectName },
      })
      .populate({
        path: "account",
      });
    return res.json(successResponse(users, "Users found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function createPhaseModel(req: Request, res: Response) {
  const { projectName } = req.params;
  const { data } = req.body; // Phase model, contains an array of phase with name and description
  try {
    const project = await ProjectModel.findOne({ name: projectName });
    if (!project) {
      return res.json(errorResponse("Project not found"));
    }
    data.forEach(async (phase: Phase) => {
      const newPhase = new PhaseModel(phase);
      await newPhase.save();
      await ProjectModel.findOneAndUpdate(
        { name: projectName },
        { $addToSet: { phaseList: newPhase._id } }
      );
    });
    return res.json(successResponse(project, "Phase added to project"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
