import mongoose from 'mongoose';

const activityHistorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdBy: String,
  updatedBy: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
}, { timestamps: true });
const ActivityHistory = mongoose.model('ActivityHistory', activityHistorySchema);

export {
  ActivityHistory,
  activityHistorySchema,
};
