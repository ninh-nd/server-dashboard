import express from "express";
import {
  get,
  getAll,
  create,
  markTask,
  remove,
} from "controllers/task.controller";
import { checkAuth } from "middlewares/auth";

const router = express.Router();

// Get all tasks
router.get("/", checkAuth, getAll);
// Get a task
router.get("/:id", checkAuth, get);
// Create a task
router.post("/", checkAuth, create);
// Change status of tasks
router.patch("/", checkAuth, markTask);
// Remove a task
router.delete("/:id", checkAuth, remove);

export default router;
