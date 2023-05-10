import express from "express";
import { getActivityHistory } from "../controllers/activityHistory.controller";
import { checkAuth } from "../middlewares/auth";

const router = express.Router();
// Get activity history of a project
router.get("/:projectName/activityHistory", checkAuth, getActivityHistory);
export default router;
