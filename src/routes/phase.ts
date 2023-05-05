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
  updateArtifact,
  getTemplates,
} from "../controllers/phase.controller";

const router = express.Router();

// Get all phase templates
router.get("/templates", getTemplates);
// Get a phase
router.get("/:id", get);
// Create a phase from a template
router.post("/templates", createFromTemplate);
// Update a phase
router.put("/:id", update);
// Remove a phase
router.delete("/:id", remove);
// Add task to a phase
router.patch("/:id/task/add/:taskId", addTaskToPhase);
// Remove task from a phase
router.patch("/:id/task/delete/:taskId", removeTaskFromPhase);
// Create and add artifact to a phase
router.patch("/:id/artifact/add", addArtifactToPhase);
// Remove and delete artifact from a phase
router.patch("/:id/artifact/delete/:artifactId", removeArtifactFromPhase);
// Update artifact in a phase
router.patch("/:id/artifact/update/:artifactId", updateArtifact);
export default router;
