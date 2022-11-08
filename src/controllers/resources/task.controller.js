import { Task } from '../../models/task.js';
import { errorResponse, successResponse } from '../../utils/responseFormat.js';

async function getAll(req, res) {
  try {
    const tasks = await Task.find();
    return res.status(200).json(successResponse(tasks, 'Tasks found'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function get(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    return res.status(200).json(successResponse(task, 'Task found'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function create(req, res) {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    return res.status(201).json(successResponse(newTask, 'Task created'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function update(req, res) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(successResponse(updatedTask, 'Task updated'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function remove(req, res) {
  Task.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      return res.status(500).json(errorResponse('Internal server error'));
    }
    if (!doc) {
      return res.status(404).json(errorResponse('Task not found'));
    }
    return res.status(200).json(successResponse(doc, 'Task deleted'));
  });
}

export {
  get,
  getAll,
  create,
  update,
  remove,
};
