import { Task } from '../../models/task.js';

async function getAll(req, res) {
  try {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function get(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function create(req, res) {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function update(req, res) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function remove(req, res) {
  Task.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!doc) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }
    return res.status(200).json({
      message: 'Task deleted',
    });
  });
}

export {
  get,
  getAll,
  create,
  update,
  remove,
};