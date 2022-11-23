import { Project } from '../../models/project'
import { Member } from '../../models/member'
import { errorResponse, successResponse } from '../../utils/responseFormat'
import { Request, Response } from 'express'
async function get (req: Request, res: Response) {
  try {
    const { projectName } = req.params
    const project = await Project.findOne({ name: projectName }).populate({
      path: 'phaseList',
      populate: {
        path: 'tasks'
      }
    })
    return res.status(200).json(successResponse(project, 'Project found'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function create (req: Request, res: Response) {
  try {
    const project = await Project.create(req.body)
    return res.status(201).json(successResponse(project, 'Project created'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function updateStatus (req: Request, res: Response) {
  try {
    const { projectName } = req.params
    const { status } = req.body
    const project = await Project.findOneAndUpdate(
      { name: projectName },
      { status },

      { new: true }
    )
    return res.status(200).json(successResponse(project, 'Project status updated'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function addPhaseToProject (req: Request, res: Response) {
  try {
    const { projectName } = req.params
    const { phaseId } = req.body
    const project = await Project.findOneAndUpdate(
      { name: projectName },
      {
        $addToSet: {
          phaseList: phaseId
        }
      },
      { new: true }
    )
    return res.status(200).json(successResponse(project, 'Phase added to project'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function remove (req: Request, res: Response) {
  try {
    const { projectName } = req.params
    const project = await Project.findOne({ name: projectName })
    if (project == null) {
      return res.status(404).json(errorResponse('Project not found'))
    }
    // Check if the project has just been created for 1 day
    if (project.createdAt.getTime() + 86400000 > Date.now()) {
      return res.status(403).json(errorResponse('Project cannot be deleted'))
    }

    await Project.findByIdAndDelete(req.params.id)
    return res.status(200).json(successResponse(project, 'Project deleted'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function getProjectMembers (req: Request, res: Response) {
  try {
    const { projectName } = req.params
    const project = await Project.findOne({ name: projectName })
    if (project == null) {
      return res.status(404).json(errorResponse('Project not found'))
    }
    const members = await Member.find({ projectId: project._id }).populate('activityHistory').populate('taskAssigned')
    return res.status(200).json(successResponse(members, 'Members found'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

export {
  get,
  create,
  updateStatus,
  addPhaseToProject,
  remove,
  getProjectMembers
}
