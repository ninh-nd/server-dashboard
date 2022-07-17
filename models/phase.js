import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  previousId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phase',
  },
  nextId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phase',
  },
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
