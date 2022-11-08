import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'active',
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: String,
  updatedBy: String,
}, { timestamps: true });
const Task = mongoose.model('Task', taskSchema);

export {
  Task,
  taskSchema,
};
