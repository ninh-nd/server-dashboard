import { Schema, Model, model } from 'mongoose'
import { ITask } from './interfaces'

const taskSchema = new Schema<ITask>({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'active'
  },
  description: {
    type: String,
    required: true
  },
  createdBy: String,
  updatedBy: String
}, { timestamps: true })
const Task: Model<ITask> = model('Task', taskSchema)

export {
  Task,
  taskSchema
}
