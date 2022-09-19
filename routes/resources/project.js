import express from 'express';
import {
  get, create, updateStatus, addPhaseToProject, remove, getProjectMembers,
} from '../../controllers/resources/project.controller.js';

const router = express.Router();

/* GET project */
router.get('/:id', get);
/* POST project */
router.post('/', create);
/* PATCH project: Update status */
router.patch('/:id', updateStatus);
/* PATCH project: Add phase to project */
router.patch('/:id/phase', addPhaseToProject);
/* DELETE project */
router.delete('/:id', remove);
/* GET project members */
router.get('/:id/member', getProjectMembers);
export default router;
