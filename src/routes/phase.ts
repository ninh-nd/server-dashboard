import express from "express";
import {
  get,
  createFromTemplate,
  update,
  remove,
  addTaskToPhase,
  removeTaskFromPhase,
  addArtifactToPhase,
  removeArtifactFromPhase,
  getTemplates,
} from "../controllers/phase.controller";

const phaseRoute = express.Router();

// Get all phase templates
phaseRoute.get("/templates", getTemplates);
// Get a phase
phaseRoute.get("/:id", get);
// Create a phase from a template
phaseRoute.post("/templates", createFromTemplate);
// Update a phase
phaseRoute.put("/:id", update);
// Remove a phase
phaseRoute.delete("/:id", remove);
// Add task to a phase
phaseRoute.patch("/:id/task/add/:taskId", addTaskToPhase);
// Remove task from a phase
phaseRoute.patch("/:id/task/delete/:taskId", removeTaskFromPhase);
// Create and add artifact to a phase
phaseRoute.patch("/:id/artifact/add", addArtifactToPhase);
// Remove and delete artifact from a phase
phaseRoute.patch("/:id/artifact/delete/:artifactId", removeArtifactFromPhase);
export default phaseRoute;
