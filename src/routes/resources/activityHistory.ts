import express from "express";
import {
  getPRs,
  getCommits,
  getCommitsByAccount,
  getPRsByAccount,
} from "controllers/resources/activityHistory.controller";
import { checkAuth } from "middlewares/auth";

const router = express.Router();
/* GET pull requests */
router.get("/:projectName/commit", checkAuth, getCommits);
/* GET commits */
router.get("/:projectName/pullrequest", checkAuth, getPRs);
/* GET commits by account */
router.get("/:projectName/commit/:username", checkAuth, getCommitsByAccount);
/* GET pull requests by account */
router.get("/:projectName/pullrequest/:username", checkAuth, getPRsByAccount);
export default router;
