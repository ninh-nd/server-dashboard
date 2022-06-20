import express from 'express';
import projectController from '../controller/pmController.js';

const router = express.Router();
// Get a project manager
router.get('/:id', projectController.getProjectManager);
// Create a project manager
router.post('/', projectController.createProjectManager);
// Update a project manager's information
router.patch('/:id', projectController.updateProjectManager);
// Delete a project manager
router.delete('/:id', projectController.deleteProjectManager);
// Add project own
router.patch('/:id/project', projectController.addProjectOwn);
export default router;
