import mongoose from 'mongoose';

const projectManagerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
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
