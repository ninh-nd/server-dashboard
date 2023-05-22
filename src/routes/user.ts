import express from "express";
import {
  get,
  create,
  update,
  remove,
  assignTask,
  getProjectIn,
  addProjectIn,
} from "../controllers/user.controller";
import { checkAuth } from "../middlewares/auth";

const userRoute = express.Router();
// Get a user's projects
userRoute.get("/project", checkAuth, getProjectIn);
// Add a project to a user
userRoute.patch("/:id/project", addProjectIn);
// Get a user
userRoute.get("/", get);
// Create a user
userRoute.post("/", create);
// Update a user
userRoute.put("/:id", update);
// Remove a user
userRoute.delete("/:id", remove);
// Assign task to a user
userRoute.patch("/:id/assignTask/:taskId", assignTask);
export default userRoute;
