import express from "express";
import {
  getPRs,
  getCommits,
  getCommitsByAccount,
  getPRsByAccount,
} from "~/controllers/activityHistory.controller";
import { checkAuth } from "~/middlewares/auth";

const router = express.Router();
// Get pull requests
router.get("/:projectName/commit", checkAuth, getCommits);
// Get commits
router.get("/:projectName/pullrequest", checkAuth, getPRs);
// Get commits by account
router.get("/:projectName/commit/:username", checkAuth, getCommitsByAccount);
// Get pull requests by account
router.get("/:projectName/pullrequest/:username", checkAuth, getPRsByAccount);
export default router;
