import express from "express";
import {
  get,
  create,
  updateStatus,
  addPhaseToProject,
  remove,
  getProjectMembers,
  createPhaseModel,
} from "~/controllers/project.controller";

const router = express.Router();

// Get a project
router.get("/:projectName", get);
// Create a project
router.post("/", create);
// Create a phase model from a given model
router.post("/:projectName", createPhaseModel);
// Update status of project
router.patch("/:projectName", updateStatus);
// Add phases to a project
router.patch("/:projectName/phase", addPhaseToProject);
// Remove a project
router.delete("/:projectName", remove);
// Get project members
router.get("/:projectName/member", getProjectMembers);
export default router;
