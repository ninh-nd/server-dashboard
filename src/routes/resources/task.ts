import express from 'express'
import {
  get, getAll, create, update, remove
} from '../../controllers/resources/task.controller'

const router = express.Router()

/* GET all tasks */
router.get('/', getAll)
/* GET task */
router.get('/:id', get)
/* POST task */
router.post('/', create)
/* PUT task */
router.put('/:id', update)
/* DELETE task */
router.delete('/:id', remove)

export default router
