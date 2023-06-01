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

phaseRoute.get("/templates", getTemplates);
phaseRoute.get("/:id", get);
phaseRoute.post("/templates", createFromTemplate);
phaseRoute.put("/:id", update);
phaseRoute.delete("/:id", remove);
phaseRoute.patch("/:id/task/add/:taskId", addTaskToPhase);
phaseRoute.patch("/:id/task/delete/:taskId", removeTaskFromPhase);
phaseRoute.patch("/:id/artifact/add", addArtifactToPhase);
phaseRoute.patch("/:id/artifact/delete/:artifactId", removeArtifactFromPhase);
export default phaseRoute;
