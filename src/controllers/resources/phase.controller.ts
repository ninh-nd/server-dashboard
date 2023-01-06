import { Phase } from 'models/phase'
import { errorResponse, successResponse } from 'utils/responseFormat'
import { Request, Response } from 'express'
import { CallbackError, Document } from 'mongoose'
import { PhasePreset } from 'models/phasePreset'
async function get(req: Request, res: Response) {
  try {
    const phase = await Phase.findById(req.params.id)
    return res.status(200).json(successResponse(phase, 'Phase found'))
  } catch (error) {
    return res.status(500).json(errorResponse(`Internal server error: ${error}`))
  }
}

async function create(req: Request, res: Response) {
  try {
    const newPhase = new Phase(req.body)
    await newPhase.save()
    return res.status(201).json(successResponse(newPhase, 'Phase created'))
  } catch (error) {
    return res.status(500).json(errorResponse(`Internal server error: ${error}`))
  }
}

async function update(req: Request, res: Response) {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.status(200).json(successResponse(updatedPhase, 'Phase updated'))
  } catch (error) {
    return res.status(500).json(errorResponse(`Internal server error: ${error}`))
  }
}

async function remove(req: Request, res: Response) {
  Phase.findByIdAndDelete(req.params.id, (error: CallbackError, doc: Document) => {
    if (error != null) {
      return res.status(500).json(errorResponse(`Internal server error: ${error}`))
    }
    if (!doc) {
      return res.status(404).json(errorResponse('Phase not found'))
    }
    return res.status(200).json(successResponse(doc, 'Phase deleted'))
  })
}

async function addTaskToPhase(req: Request, res: Response) {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { tasks: req.body.taskId } },

      { new: true }
    )
    return res.status(200).json(successResponse(updatedPhase, 'Task added to phase'))
  } catch (error) {
    return res.status(500).json(errorResponse(`Internal server error: ${error}`))
  }
}

async function getPresets(req: Request, res: Response) {
  try {
    const presets = await PhasePreset.find()
    return res.status(200).json(successResponse(presets, 'Phase presets found'))
  } catch (error) {
    console.log(error)
    return res.status(500).json(errorResponse(`Internal server error: ${error}`))
  }
}

export {
  get,
  create,
  update,
  remove,
  addTaskToPhase,
  getPresets
}
