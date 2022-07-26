import express from 'express';
import taskController from '../../controller/resources/taskController.js';

const router = express.Router();

// Get all tasks
router.get('/', taskController.getAllTask);
// Get a task
router.get('/:id', taskController.getTask);
// Create a new task
router.post('/', taskController.createTask);
// Update a task
router.patch('/:id', taskController.updateTask);
// Delete a task
router.delete('/:id', taskController.deleteTask);

export default router;
