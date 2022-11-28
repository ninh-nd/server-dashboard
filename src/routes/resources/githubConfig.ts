import express from 'express'
import { get, create, update } from '../../controllers/resources/githubConfig.controller'

const router = express.Router()
/* GET github config */
router.get('/:id', get)
/* POST github config */
router.post('/', create)
/* PUT github config */
router.put('/:id', update)
