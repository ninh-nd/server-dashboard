import mongoose from 'mongoose';

const githubConfigSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project',
  },
  accessToken: {
    type: String,
    required: true,
  },
  repo: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});
const GithubConfig = mongoose.model('GithubConfig', githubConfigSchema);

export {
  GithubConfig,
  githubConfigSchema,
};
