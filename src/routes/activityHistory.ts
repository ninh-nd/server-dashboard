import express from "express";
import { getActivityHistory } from "../controllers/activityHistory.controller";
import { checkAuth } from "../middlewares/auth";

const activityHistoryRoute = express.Router();
// Get activity history of a project
activityHistoryRoute.get(
  "/:projectName/activityHistory",
  checkAuth,
  getActivityHistory
);
export default activityHistoryRoute;
