import { Schema, Model, model } from 'mongoose'
import { IPhase } from './interfaces'

const phaseSchema = new Schema<IPhase>({
  name: {
    type: String,
    required: true
  },
  description: String,
  previousId: {
    type: Schema.Types.ObjectId,
    ref: 'Phase'
  },
  nextId: {
    type: Schema.Types.ObjectId,
    ref: 'Phase'
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
    default: []
  }],
  createdBy: String,
  updatedBy: String
}, { timestamps: true })
const Phase: Model<IPhase> = model('Phase', phaseSchema)

export {
  Phase,
  phaseSchema
}