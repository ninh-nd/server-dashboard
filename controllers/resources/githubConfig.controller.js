import { GithubConfig } from '../../models/githubConfig.js';

async function get(req, res) {
  const { id } = req.params;
  try {
    const githubConfig = await GithubConfig.findOne({ projectId: id });
    if (githubConfig) {
      res.status(200).json(githubConfig);
    } else {
      res.status(404).json({ message: 'Github config not found for this project id' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  const githubConfig = new GithubConfig(req.body);
  try {
    const newGithubConfig = await githubConfig.save();
    res.status(201).json(newGithubConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      res.status(200).json(githubConfig);
    } else {
      res.status(404).json({ message: 'Github config not found for this project id' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  get,
  create,
  update,
};
