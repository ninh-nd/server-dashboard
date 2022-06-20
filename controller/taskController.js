import { Task } from '../models/task.js';

const taskController = {
  getAllTask: async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getTask: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  createTask: async (req, res) => {
    try {
      const newTask = new Task(req.body);
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateTask: async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteTask: (req, res) => {
    Task.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) {
        res.status(500).json(err);
      }
      if (!doc) {
        res.status(404).json({
          message: 'Task not found',
        });
      } else {
        res.status(200).json({
          message: 'Task deleted',
        });
      }
    });
  },
};

export default taskController;
