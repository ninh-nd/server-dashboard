import { Schema, Model, model } from 'mongoose'
import { ITask } from './interfaces'

const taskSchema = new Schema<ITask>({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'completed']
  },
  description: {
    type: String,
    required: true
  },
  createdBy: String,
  updatedBy: String,
  projectName: {
    type: String,
    required: true
  }
}, { timestamps: true })
const Task: Model<ITask> = model('Task', taskSchema)

export {
  Task,
  taskSchema
}
