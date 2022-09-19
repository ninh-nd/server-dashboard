import express from 'express';
import {
  getPRs, getCommits, getCommitsByAccount, getPRsByAccount,
} from '../../controllers/resources/activityHistory.controller.js';

const router = express.Router();
/* GET pull requests */
router.get('/pr', getPRs);
/* GET commits */
router.get('/commit', getCommits);
/* GET commits by account */
router.get('/commit/:id', getCommitsByAccount);
/* GET pull requests by account */
router.get('/pr/:id', getPRsByAccount);
export default router;
