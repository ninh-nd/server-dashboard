import mongoose from 'mongoose';
import { accountSchema } from './account.js';

const projectManagerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: accountSchema,
    required: true,
  },
  company: String,
  projectOwn: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Project',
  }],
});
const ProjectManager = mongoose.model('ProjectManager', projectManagerSchema);

export {
  ProjectManager,
  projectManagerSchema,
};
