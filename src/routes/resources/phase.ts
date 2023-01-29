import express from "express";
import {
  get,
  create,
  update,
  remove,
  addTaskToPhase,
  getPresets,
  removeTaskFromPhase,
  addArtifactToPhase,
  removeArtifactFromPhase,
  updateArtifact,
} from "controllers/resources/phase.controller";

const router = express.Router();

/* GET phase presets */
router.get("/presets", getPresets);
/* GET phase */
router.get("/:id", get);
/* POST phase */
router.post("/", create);
/* PUT phase */
router.put("/:id", update);
/* DELETE phase */
router.delete("/:id", remove);
/* PATCH phase: Add task to a phase */
router.patch("/:id/task/add", addTaskToPhase);
/* PATCH phase: Remove task from a phase */
router.patch("/:id/task/delete", removeTaskFromPhase);
/* PATCH phase: Create and add artifact to a phase */
router.patch("/:id/artifact/add", addArtifactToPhase);
/* PATCH phase: Remove and delete artifact from a phase */
router.patch("/:id/artifact/delete/:artifactId", removeArtifactFromPhase);
/* PATCH phase: Update artifact in a phase */
router.patch("/:id/artifact/update/:artifactId", updateArtifact);
export default router;
