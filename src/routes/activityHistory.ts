import express from "express";
import {
  getActivityHistoryByProject,
  getActivityHistoryByUsername,
} from "../controllers/activityHistory.controller";
import { checkAuth } from "../middlewares/auth";

const router = express.Router();
// Get activity history of a project
router.get(
  "/:projectName/activityHistory",
  checkAuth,
  getActivityHistoryByProject
);
// Get activity history by account
router.get(
  "/:projectName/activityHistory/:username",
  checkAuth,
  getActivityHistoryByUsername
);
export default router;
