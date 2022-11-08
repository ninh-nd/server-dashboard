import express from 'express';
import {
  get, create, update, remove, addProjectOwn, getProjectOwn,
} from '../../controllers/resources/projectManager.controller.js';

const router = express.Router();
/* GET project manager */
router.get('/:id', get);
/* POST project manager */
router.post('/', create);
/* PUT project manager */
router.put('/:id', update);
/* DELETE project manager */
router.delete('/:id', remove);
/* PATCH project manager: Add project to project manager */
router.patch('/:id/project', addProjectOwn);
/* GET project manager projects */
router.get('/:id/project', getProjectOwn);
export default router;
