import express from 'express';
import projectController from '../../controller/resources/projectController.js';

const router = express.Router();

// Get a project
router.get('/:id', projectController.getProject);
// Create a project
router.post('/', projectController.createProject);
// Change project status
router.patch('/:id', projectController.updateProjectStatus);
// Add a phase to the project
router.patch('/:id/phase', projectController.addPhase);
// Delete a project
router.delete('/:id', projectController.deleteProject);
// Get project's member
router.get('/:id/member', projectController.getProjectMember);
export default router;
