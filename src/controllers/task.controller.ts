import { Request, Response } from "express";
import { Task } from "models/task";
import { Project } from "models/project";
import { CallbackError, Document } from "mongoose";
import { errorResponse, successResponse } from "utils/responseFormat";
export async function getAll(req: Request, res: Response) {
  const { projectName, filter } = req.query;
  try {
    const tasks = await Task.find({ projectName });
    if (filter !== "all") {
      const project = await Project.findOne({ name: projectName }).populate(
        "phaseList"
      );
      if (filter === "unassigned") {
        const filteredTasks = tasks.filter((task) => {
          let isAssigned = false;
          project?.phaseList.forEach((phase) => {
            // @ts-ignore
            if (phase.tasks.includes(task._id)) {
              isAssigned = true;
            }
          });
          return !isAssigned;
        });
        return res.json(successResponse(filteredTasks, "Tasks found"));
      } else if (filter === "assigned") {
        const filteredTasks = tasks.filter((task) => {
          let isAssigned = false;
          project?.phaseList.forEach((phase) => {
            // @ts-ignore
            if (phase.tasks.includes(task._id)) {
              isAssigned = true;
            }
          });
          return isAssigned;
        });
        return res.json(successResponse(filteredTasks, "Tasks found"));
      }
    } else {
      return res.json(successResponse(tasks, "Tasks found"));
    }
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
    if (error) {
      return res.json(errorResponse(`Internal server error: ${error}`));
    }
    if (!doc) {
      return res.json(errorResponse("Task not found"));
    }
    return res.json(successResponse(doc, "Task deleted"));
  });
}
