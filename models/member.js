import mongoose from 'mongoose';
import { accountSchema } from './account.js';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: accountSchema,
    required: true,
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
});
const Member = mongoose.model('Member', memberSchema);

export {
  Member,
  memberSchema,
};
