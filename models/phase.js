import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  // previousId: Number,
  // nextId: Number,
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: [],
  }],
  createdBy: String,
  updatedBy: String,
}, { timestamps: true });
const Phase = mongoose.model('Phase', phaseSchema);

export {
  Phase,
  phaseSchema,
};
