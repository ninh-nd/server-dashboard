import { Request, Response } from "express";
import { Task } from "models/task";
import { errorResponse, successResponse } from "utils/responseFormat";
import { CallbackError, Condition, Document } from "mongoose";
import { ITask } from "models/interfaces";
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

export async function markTask(req: Request, res: Response) {
  const { data, status } = req.body;
  // @ts-ignore
  let op = [];
  try {
    const arrayOfTaskId = data;
    arrayOfTaskId.forEach((id: string) => {
      op.push({
        updateOne: {
          filter: { _id: id },
          update: { status: status },
        },
      });
    });
    // @ts-ignore
    const updatedTask = await Task.bulkWrite(op);
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
