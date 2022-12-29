import mongoose from 'mongoose'
import { GithubConfig } from 'models/githubConfig'
import { errorResponse, successResponse } from 'utils/responseFormat'
import { Request, Response } from 'express'
async function get(req: Request, res: Response) {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(errorResponse('Invalid project id'))
  }
  try {
    const githubConfig = await GithubConfig.findOne({ projectId: id })
    if (githubConfig != null) {
      return res.status(200).json(successResponse(githubConfig, 'Github config found'))
    }
    return res.status(404).json(errorResponse('No Github config found'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function create(req: Request, res: Response) {
  const githubConfig = new GithubConfig(req.body)
  try {
    const newGithubConfig = await githubConfig.save()
    return res.status(201).json(successResponse(newGithubConfig, 'Github config created'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

async function update(req: Request, res: Response) {
  const { id } = req.params
  try {
    const githubConfig = await GithubConfig.findOneAndUpdate(
      { projectId: id },
      req.body,

      { new: true }
    )
    if (githubConfig != null) {
      return res.status(200).json(successResponse(githubConfig, 'Github config updated'))
    }
    return res.status(404).json(errorResponse('No Github config found'))
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'))
  }
}

export {
  get,
  create,
  update
}
