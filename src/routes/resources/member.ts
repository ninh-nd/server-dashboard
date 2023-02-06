import express from "express";
import {
  get,
  create,
  update,
  remove,
  assignTask,
  joinProject,
} from "controllers/resources/member.controller";

const router = express.Router();

// Get a member
router.get("/:id", get);
// Create a member
router.post("/", create);
// Update a member
router.put("/:id", update);
// Remove a member
router.delete("/:id", remove);
// Assign task to a member
router.patch("/:id/assignTask/:taskId", assignTask);
// Let a member join a project
router.patch("/:id/joinProject", joinProject);
export default router;
