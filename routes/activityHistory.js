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
export default router;
