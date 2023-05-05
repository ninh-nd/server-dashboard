import { Request, Response } from "express";
import { CallbackError, Document } from "mongoose";
import {
  ArtifactModel,
  PhaseModel,
  PhaseTemplateModel,
  ProjectModel,
} from "../models/models";
import { errorResponse, successResponse } from "../utils/responseFormat";
import { fetchVulnsFromNVD } from "../utils/vuln";
export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const phase = await PhaseModel.findById(id).populate([
      {
        path: "tasks",
      },
      {
        path: "artifacts",
        populate: {
          path: "threatList vulnerabilityList",
        },
      },
    ]);
    return res.json(successResponse(phase, "Phase found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function createFromTemplate(req: Request, res: Response) {
  const { data, projectName } = req.body;
  const username = req.user?.username;
  const { phases } = data;
  try {
    // Template check: To determine whether is a new template or an existing one
    if (!data._id) {
      const newTemplate = await PhaseTemplateModel.create({
        ...data,
        createdBy: username,
      });
    }
    // Create new phases
    const phasesWithoutIds = phases.map(
      ({
        name,
        description,
        order,
      }: {
        name: string;
        description: string;
        order: number;
      }) => ({
        name,
        description,
        order,
      })
    );
    const phasesCreated = await PhaseModel.insertMany(phasesWithoutIds);
    // Add phases to project
    await ProjectModel.findOneAndUpdate(
      { name: projectName },
      { phaseList: phasesCreated.map((phase) => phase._id) }
    );
    return res.json(
      successResponse(phasesCreated, "Phases and template created")
    );
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { data } = req.body;
  try {
    const updatedPhase = await PhaseModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return res.json(successResponse(updatedPhase, "Phase updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  PhaseModel.findByIdAndDelete(id, (error: CallbackError, doc: Document) => {
    if (error) {
      return res.json(errorResponse(`Internal server error: ${error}`));
    }
    if (!doc) {
      return res.json(errorResponse("Phase not found"));
    }
    return res.json(successResponse(doc, "Phase deleted"));
  });
}

export async function addTaskToPhase(req: Request, res: Response) {
  const { id, taskId } = req.params;
  try {
    const updatedPhase = await PhaseModel.findByIdAndUpdate(
      id,
      { $addToSet: { tasks: taskId } },

      { new: true }
    );
    return res.json(successResponse(updatedPhase, "Task added to phase"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function removeTaskFromPhase(req: Request, res: Response) {
  const { id, taskId } = req.params;
  try {
    const updatedPhase = await PhaseModel.findByIdAndUpdate(
      id,
      { $pull: { tasks: taskId } },

      { new: true }
    );
    return res.json(successResponse(updatedPhase, "Task removed from phase"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function getTemplates(req: Request, res: Response) {
  const username = req.user?.username;
  try {
    const templates = await PhaseTemplateModel.find().or([
      { isPrivate: false },
      { createdBy: username },
    ]);
    return res.json(successResponse(templates, "Phase templates found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function addArtifactToPhase(req: Request, res: Response) {
  const { id } = req.params;
  const { data } = req.body;
  const { cpe } = data;
  // Attempt to find CVEs if CPE exists
  if (cpe) {
    try {
      const vulns = await fetchVulnsFromNVD(cpe);
      data.vulnerabilityList = vulns;
    } catch (error) {
      data.vulnerabilityList = [];
    }
  }
  const ar = new ArtifactModel(data);
  try {
    await ar.save();
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
  try {
    const updatedPhase = await PhaseModel.findByIdAndUpdate(
      id,
      { $addToSet: { artifacts: ar._id } },
      { new: true }
    );
    return res.json(successResponse(updatedPhase, "Artifact added to phase"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function removeArtifactFromPhase(req: Request, res: Response) {
  const { id, artifactId } = req.params;
  try {
    const updatedPhase = await PhaseModel.findByIdAndUpdate(id, {
      $pull: { artifacts: artifactId },
    });
    await ArtifactModel.deleteOne({ _id: artifactId });
    return res.json(
      successResponse(updatedPhase, "Artifact removed from phase")
    );
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function updateArtifact(req: Request, res: Response) {
  const { id, artifactId } = req.params;
  const { data } = req.body;
  try {
    await ArtifactModel.findOneAndUpdate({ _id: artifactId }, data, {
      new: true,
    });
    const updatedPhase = await PhaseModel.findById(id);
    return res.json(successResponse(updatedPhase, "Artifact updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
