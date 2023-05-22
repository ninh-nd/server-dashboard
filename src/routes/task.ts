import express from "express";
import {
  get,
  getAll,
  create,
  update,
  remove,
} from "../controllers/task.controller";
import { checkAuth } from "../middlewares/auth";

const taskRoute = express.Router();

// Get all tasks
taskRoute.get("/", checkAuth, getAll);
// Get a task
taskRoute.get("/:id", checkAuth, get);
// Create a task
taskRoute.post("/", checkAuth, create);
// Change status of tasks
taskRoute.patch("/:id", checkAuth, update);
// Remove a task
taskRoute.delete("/:id", checkAuth, remove);

export default taskRoute;
