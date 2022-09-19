import express from 'express';
import {
  getAll, get, create, update, remove,
} from '../../controllers/resources/thirdParty.controller.js';

const router = express.Router();

/* GET all third parties */
router.get('/', getAll);
/* GET third party */
router.get('/:id', get);
/* POST third party */
router.post('/', create);
/* PUT third party */
router.put('/:id', update);
/* DELETE third party */
router.delete('/:id', remove);

export default router;
