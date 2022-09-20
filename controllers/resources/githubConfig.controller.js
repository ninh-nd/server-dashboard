import mongoose from 'mongoose';
import { GithubConfig } from '../../models/githubConfig.js';

async function get(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid project id' });
  }
  try {
    const githubConfig = await GithubConfig.findOne({ projectId: id });
    if (githubConfig) {
      return res.status(200).json(githubConfig);
    }
    return res.status(404).json({ message: 'Github config not found for this project id' });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function create(req, res) {
  const githubConfig = new GithubConfig(req.body);
  try {
    const newGithubConfig = await githubConfig.save();
    return res.status(201).json(newGithubConfig);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function update(req, res) {
  const { id } = req.params;
  try {
    const githubConfig = await GithubConfig.findOneAndUpdate(
      { projectId: id },
      req.body,

      { new: true },
    );
    if (githubConfig) {
      return res.status(200).json(githubConfig);
    }
    return res.status(404).json({ message: 'Github config not found for this project id' });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

export {
  get,
  create,
  update,
};
