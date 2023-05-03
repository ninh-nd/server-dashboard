import express from "express";
import {
  get,
  create,
  update,
  remove,
  assignTask,
  getProjectIn,
  addProjectIn,
} from "~/controllers/user.controller";
import { checkAuth } from "~/middlewares/auth";

const router = express.Router();
// Get a user's projects
router.get("/project", checkAuth, getProjectIn);
// Add a project to a user
router.patch("/:id/project", addProjectIn);
// Get a user
router.get("/:id", get);
// Create a user
router.post("/", create);
// Update a user
router.put("/:id", update);
// Remove a user
router.delete("/:id", remove);
// Assign task to a user
router.patch("/:id/assignTask/:taskId", assignTask);
export default router;
