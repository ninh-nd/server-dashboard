import { Schema, Model, model } from 'mongoose'
import { IGithubConfig } from './interfaces'

const githubConfigSchema = new Schema<IGithubConfig>({
  projectId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  accessToken: {
    type: String,
    required: true
  },
  repo: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
})
const GithubConfig: Model<IGithubConfig> = model('GithubConfig', githubConfigSchema)

export {
  GithubConfig,
  githubConfigSchema
}
