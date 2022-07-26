import express from 'express';
import memberController from '../../controller/resources/memberController.js';

const router = express.Router();

// Get a member
router.get('/:id', memberController.getMember);
// Create a member
router.post('/', memberController.createMember);
// Update a member
router.patch('/:id', memberController.updateMember);
// Delete a member
router.delete('/:id', memberController.deleteMember);
// Assign a task to a member
router.patch('/:id/task', memberController.assignTask);
// Add a project that the member participates in
router.patch('/:id/project', memberController.addProject);
export default router;
