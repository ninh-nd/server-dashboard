import { Request, Response } from "express";
import { Task } from "models/task";
import { errorResponse, successResponse } from "utils/responseFormat";
import { CallbackError, Document } from "mongoose";
async function getAll(req: Request, res: Response) {
  try {
    const projectName = req.query.projectName;
    const tasks = await Task.find({ projectName });
    return res.json(successResponse(tasks, "Tasks found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

async function get(req: Request, res: Response) {
  try {
    const task = await Task.findById(req.params.id);
    return res.json(successResponse(task, "Task found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

async function create(req: Request, res: Response) {
  try {
    const { name, description, projectName, status } = req.body;
    const newTask = new Task({ name, description, projectName, status });
    await newTask.save();
    return res.json(successResponse(newTask, "Task created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

async function update(req: Request, res: Response) {
  try {
    const { name, status, description } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { name, status, description },
      { new: true }
    );
    return res.json(successResponse(updatedTask, "Task updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

async function remove(req: Request, res: Response) {
  Task.findByIdAndDelete(
    req.params.id,
    (error: CallbackError, doc: Document) => {
      if (error != null) {
        return res.json(errorResponse(`Internal server error: ${error}`));
      }
      if (!doc) {
        return res.json(errorResponse("Task not found"));
      }
      return res.json(successResponse(doc, "Task deleted"));
    }
  );
}

export { get, getAll, create, update, remove };
