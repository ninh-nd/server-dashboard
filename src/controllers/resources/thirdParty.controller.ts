import { ThirdParty } from 'models/thirdParty'
import { errorResponse, successResponse } from 'utils/responseFormat'
import { Request, Response } from 'express'
import { CallbackError, Document } from 'mongoose'
async function getAll(req: Request, res: Response) {
  try {
    const thirdParties = await ThirdParty.find()
    return res.status(200).json(successResponse(thirdParties, 'Third parties found'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function get(req: Request, res: Response) {
  try {
    const thirdParty = await ThirdParty.findById(req.params.id)
    return res.status(200).json(successResponse(thirdParty, 'Third party found'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function create(req: Request, res: Response) {
  try {
    const newThirdParty = new ThirdParty(req.body)
    await newThirdParty.save()
    return res.status(201).json(successResponse(newThirdParty, 'Third party created'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function update(req: Request, res: Response) {
  try {
    const updatedThirdParty = await ThirdParty.findByIdAndUpdate(
      req.params.id,
      req.body,

      { new: true }
    )
    return res.status(200).json(successResponse(updatedThirdParty, 'Third party updated'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function remove(req: Request, res: Response) {
  ThirdParty.findByIdAndDelete(req.params.id, (err: CallbackError, doc: Document) => {
    if (err != null) {
      return res.status(500).json(errorResponse('Internal server error'))
    }
    if (!doc) {
      return res.status(404).json(errorResponse('Third party not found'))
    }
    return res.status(200).json(successResponse(doc, 'Third party deleted'))
  })
}

export {
  get,
  getAll,
  create,
  update,
  remove
}
