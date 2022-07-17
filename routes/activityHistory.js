import express from 'express';
import activityController from '../controller/activityController.js';

const router = express.Router();

// Add all pull requests of a repo to the database
router.post('/pr', activityController.addPRs);
// Get all pull requests of a repo from the database
router.get('/pr', activityController.getPRs);
// Add all commits of a repo to the database
router.post('/commit', activityController.addCommits);
// Get all commits of a repo from the database
router.get('/commit', activityController.getCommits);
// Get all commits of an account from the database
router.get('/commit/:id', activityController.getCommitsByAccount);
// Get all pull requests of an account from the database
router.get('/pr/:id', activityController.getPRsByAccount);
export default router;
