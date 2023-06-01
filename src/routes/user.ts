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
userRoute.get("/project", checkAuth, getProjectIn);
userRoute.patch("/:id/project", addProjectIn);
userRoute.get("/", get);
userRoute.post("/", create);
userRoute.put("/:id", update);
userRoute.delete("/:id", remove);
userRoute.patch("/:id/assignTask/:taskId", assignTask);
export default userRoute;
