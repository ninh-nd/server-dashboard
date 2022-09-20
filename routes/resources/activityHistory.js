import express from 'express';
import {
  getPRs, getCommits, getCommitsByAccount, getPRsByAccount,
} from '../../controllers/resources/activityHistory.controller.js';

const router = express.Router();
/* GET pull requests */
router.get('/:projectName/commit', getPRs);
/* GET commits */
router.get('/:projectName/pullrequest', getCommits);
/* GET commits by account */
router.get('/:projectName/commit/:username', getCommitsByAccount);
/* GET pull requests by account */
router.get('/:projectName/pullrequest/:username', getPRsByAccount);
export default router;
