import express from 'express';
import projectController from '../../controller/resources/pmController.js';

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
// Get the first project own
router.get('/:id/project', projectController.getProjectOwn);
export default router;
