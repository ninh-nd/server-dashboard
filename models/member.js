import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  company: String,
  taskAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: [],
  }],
  activityHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityHistory',
    default: [],
  }],
  projectIn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: [],
  }],
});
const Member = mongoose.model('Member', memberSchema);

export {
  Member,
  memberSchema,
};
