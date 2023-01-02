import express from 'express'
import {
  get, create, update, remove, addTaskToPhase, getPresets
} from 'controllers/resources/phase.controller'

const router = express.Router()

/* GET phase presets */
router.get('/presets', getPresets)
/* GET phase */
router.get('/:id', get)
/* POST phase */
router.post('/', create)
/* PUT phase */
router.put('/:id', update)
/* DELETE phase */
router.delete('/:id', remove)
/* PATCH phase: Add task to a phase */
router.patch('/:id/task', addTaskToPhase)
export default router
