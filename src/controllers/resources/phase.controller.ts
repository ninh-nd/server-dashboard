import { Phase } from "models/phase";
import { errorResponse, successResponse } from "utils/responseFormat";
import { Request, Response } from "express";
import { CallbackError, Document } from "mongoose";
import { PhasePreset } from "models/phasePreset";
import { Artifact } from "models/artifact";
export async function get(req: Request, res: Response) {
  try {
    const phase = await Phase.findById(req.params.id);
    return res.json(successResponse(phase, "Phase found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  try {
    const newPhase = new Phase(req.body);
    await newPhase.save();
    return res.json(successResponse(newPhase, "Phase created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.json(successResponse(updatedPhase, "Phase updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  Phase.findByIdAndDelete(
    req.params.id,
    (error: CallbackError, doc: Document) => {
      if (error != null) {
        return res.json(errorResponse(`Internal server error: ${error}`));
      }
      if (!doc) {
        return res.json(errorResponse("Phase not found"));
      }
      return res.json(successResponse(doc, "Phase deleted"));
    }
  );
}

export async function addTaskToPhase(req: Request, res: Response) {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { tasks: req.body.taskId } },

      { new: true }
    );
    return res.json(successResponse(updatedPhase, "Task added to phase"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function removeTaskFromPhase(req: Request, res: Response) {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(
      req.params.id,
      { $pull: { tasks: req.body.taskId } },

      { new: true }
    );
    return res.json(successResponse(updatedPhase, "Task removed from phase"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function getPresets(req: Request, res: Response) {
  try {
    const presets = await PhasePreset.find();
    return res.json(successResponse(presets, "Phase presets found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function addArtifactToPhase(req: Request, res: Response) {
  const { id } = req.params;
  const { artifact } = req.body;
  const ar = new Artifact(artifact);
  try {
    await ar.save();
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(
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
    const updatedPhase = await Phase.findByIdAndUpdate(id, {
      $pull: { artifacts: artifactId },
    });
    await Artifact.deleteOne({ _id: artifactId });
    return res.json(
      successResponse(updatedPhase, "Artifact removed from phase")
    );
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function updateArtifact(req: Request, res: Response) {
  const { id, artifactId } = req.params;
  const { artifact } = req.body;
  try {
    await Artifact.findOneAndUpdate({ _id: artifactId }, artifact, {
      new: true,
    });
    const updatedPhase = await Phase.findById(id);
    return res.json(successResponse(updatedPhase, "Artifact updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
