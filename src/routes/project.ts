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

projectRoute.get("/:projectName", get);
projectRoute.post("/", create);
projectRoute.post("/:projectName", createPhaseModel);
projectRoute.patch("/:projectName", updateStatus);
projectRoute.patch("/:projectName/phase", addPhaseToProject);
projectRoute.delete("/:projectName", remove);
projectRoute.get("/:projectName/member", getProjectMembers);
export default projectRoute;
