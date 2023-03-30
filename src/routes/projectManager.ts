import { checkProjectManager, checkAuth } from "middlewares/auth";
import express from "express";
import {
  get,
  create,
  update,
  remove,
  addProjectOwn,
  getProjectOwn,
} from "controllers/projectManager.controller";

const router = express.Router();
// Get a project manager's projects
router.get("/project", checkAuth, checkProjectManager, getProjectOwn);
// Get a project manager
router.get("/:id", get);
// Create a project manager
router.post("/", create);
// Update a project manager
router.put("/:id", update);
// Remove a project manager
router.delete("/:id", remove);
// Add a project to aproject manager
router.patch("/:id/project", addProjectOwn);
export default router;
