import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  description: String,
  startDate: Date,
  endDate: Date,
  createdBy: String,
  updatedBy: String,
  phaseList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phase',
    default: [],
  }]
}, { timestamps: true });
const Project = mongoose.model('Project', projectSchema);

export {
  Project,
  projectSchema,
};
