import express from 'express'
import {
  get, create, updateStatus, addPhaseToProject, remove, getProjectMembers
} from 'controllers/resources/project.controller'

const router = express.Router()

/* GET project */
router.get('/:projectName', get)
/* POST project */
router.post('/', create)
/* PATCH project: Update status */
router.patch('/:projectName', updateStatus)
/* PATCH project: Add phase to project */
router.patch('/:projectName/phase', addPhaseToProject)
/* DELETE project */
router.delete('/:projectName', remove)
/* GET project members */
router.get('/:projectName/member', getProjectMembers)
export default router
