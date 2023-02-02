import { Request, Response } from "express";
import { Task } from "models/task";
import { errorResponse, successResponse } from "utils/responseFormat";
import { CallbackError, Document } from "mongoose";
export async function getAll(req: Request, res: Response) {
  try {
    const projectName = req.query.projectName;
    const tasks = await Task.find({ projectName });
    return res.json(successResponse(tasks, "Tasks found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    return res.json(successResponse(task, "Task found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  const { data } = req.body;
  const { name, description, projectName, status } = data;
  try {
    const newTask = new Task({ name, description, projectName, status });
    await newTask.save();
    return res.json(successResponse(newTask, "Task created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { data } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, data, { new: true });
    return res.json(successResponse(updatedTask, "Task updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  Task.findByIdAndDelete(id, (error: CallbackError, doc: Document) => {
    if (error != null) {
      return res.json(errorResponse(`Internal server error: ${error}`));
    }
    if (!doc) {
      return res.json(errorResponse("Task not found"));
    }
    return res.json(successResponse(doc, "Task deleted"));
  });
}
