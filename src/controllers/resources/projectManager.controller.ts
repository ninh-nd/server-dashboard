import { ProjectManager } from '../../models/projectManager'
import { errorResponse, successResponse } from '../../utils/responseFormat'
import { Request, Response } from 'express'
import { CallbackError, Document } from 'mongoose'
async function get (req: Request, res: Response) {
  try {
    const pm = await ProjectManager.findById(req.params.id)
    return res.status(200).json(successResponse(pm, 'Project Manager found'))
  } catch (err) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function create (req: Request, res: Response) {
  try {
    const pm = await ProjectManager.create(req.body)
    return res.status(201).json(successResponse(pm, 'Project Manager created'))
  } catch (err) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function update (req: Request, res: Response) {
  try {
    const pm = await ProjectManager.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.status(200).json(successResponse(pm, 'Project Manager updated'))
  } catch (err) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function remove (req: Request, res: Response) {
  ProjectManager.findByIdAndDelete(req.params.id, (err: CallbackError, doc: Document) => {
    if (err != null) {
      return res.status(500).json(errorResponse('Internal server error'))
    }
    if (!doc) {
      return res.status(404).json(errorResponse('Project Manager not found'))
    }
    return res.status(200).json(successResponse(doc, 'Project Manager deleted'))
  })
}

async function addProjectOwn (req: Request, res: Response) {
  try {
    const pm = await ProjectManager.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { projectOwn: req.body.projectId } },
      { new: true }
    )
    return res.status(200).json(successResponse(pm, 'Project added to Project Manager'))
  } catch (err) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function getProjectOwn (req: Request, res: Response) {
  try {
    const pm = await ProjectManager.findById(req.params.id).populate('projectOwn')
    if (pm == null) {
      return res.status(404).json(errorResponse('Project Manager not found'))
    }
    const data = { projects: pm.projectOwn }
    return res.status(200).json(successResponse(data, ''))
  } catch (err) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

export {
  get,
  create,
  update,
  remove,
  addProjectOwn,
  getProjectOwn
}
