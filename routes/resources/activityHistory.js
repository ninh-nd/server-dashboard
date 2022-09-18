import express from 'express';
import activityController from '../../controller/resources/activityController.js';

const router = express.Router();
// Get all pull requests of a repo from the database
router.get('/pr', activityController.getPRs);
// Get all commits of a repo from the database
router.get('/commit', activityController.getCommits);
// Get all commits of an account from the database
router.get('/commit/:id', activityController.getCommitsByAccount);
// Get all pull requests of an account from the database
router.get('/pr/:id', activityController.getPRsByAccount);
export default router;
