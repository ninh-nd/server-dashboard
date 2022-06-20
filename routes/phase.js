import express from 'express';
import phaseController from '../controller/phaseController.js';

const router = express.Router();

// Get a phase
router.get('/:id', phaseController.getPhase);
// Create a phase
router.post('/', phaseController.createPhase);
// Update a phase
router.patch('/:id', phaseController.updatePhase);
// Delete a phase
router.delete('/:id', phaseController.deletePhase);
// Add task to phase
router.patch('/:id/task', phaseController.addTask);
export default router;
