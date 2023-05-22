import express from "express";
import {
  get,
  create,
  updateStatus,
  addPhaseToProject,
  remove,
  getProjectMembers,
  createPhaseModel,
} from "../controllers/project.controller";

const projectRoute = express.Router();

// Get a project
projectRoute.get("/:projectName", get);
// Create a project
projectRoute.post("/", create);
// Create a phase model from a given model
projectRoute.post("/:projectName", createPhaseModel);
// Update status of project
projectRoute.patch("/:projectName", updateStatus);
// Add phases to a project
projectRoute.patch("/:projectName/phase", addPhaseToProject);
// Remove a project
projectRoute.delete("/:projectName", remove);
// Get project members
projectRoute.get("/:projectName/member", getProjectMembers);
export default projectRoute;
