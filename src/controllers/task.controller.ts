import { isDocumentArray } from "@typegoose/typegoose";
import { Request, Response } from "express";
import { CallbackError, Document } from "mongoose";
import { ProjectModel, TaskModel } from "../models/models";
import { errorResponse, successResponse } from "../utils/responseFormat";
export async function getAll(req: Request, res: Response) {
  const { projectName, filter } = req.query;
  try {
    const tasks = await TaskModel.find({ projectName });
    const project = await ProjectModel.findOne({
      name: projectName,
    }).populate("phaseList");
    if (!project) {
      return res.json(errorResponse("Project not found"));
    }
    switch (filter) {
      case "unassigned":
        const filteredUnassigned = tasks.filter((task) => {
          let isAssigned = false;
          if (isDocumentArray(project.phaseList)) {
            project.phaseList.forEach((phase) => {
              if (phase.tasks.includes(task._id)) {
                isAssigned = true;
              }
            });
            return !isAssigned;
          }
        });
        return res.json(successResponse(filteredUnassigned, "Tasks found"));
      case "assigned":
        const filteredAssigned = tasks.filter((task) => {
          let isAssigned = false;
          if (isDocumentArray(project.phaseList)) {
            project.phaseList.forEach((phase) => {
              if (phase.tasks.includes(task._id)) {
                isAssigned = true;
              }
            });
            return isAssigned;
          }
        });
        return res.json(successResponse(filteredAssigned, "Tasks found"));
    }
    return res.json(successResponse(tasks, "Tasks found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const task = await TaskModel.findById(id);
    return res.json(successResponse(task, "Task found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  const { data } = req.body;
  const { name, description, projectName, status } = data;
  try {
    const newTask = new TaskModel({ name, description, projectName, status });
    await newTask.save();
    return res.json(successResponse(newTask, "Task created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function markTask(req: Request, res: Response) {
  const { data, status } = req.body;
  let operations: any[] = [];
  try {
    const arrayOfTaskId = data;
    arrayOfTaskId.forEach((id: string) => {
      operations.push({
        updateOne: {
          filter: { _id: id },
          update: { status: status },
        },
      });
    });
    const updatedTask = await TaskModel.bulkWrite(operations);
    return res.json(successResponse(updatedTask, "Task updated"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  TaskModel.findByIdAndDelete(id, (error: CallbackError, doc: Document) => {
    if (error) {
      return res.json(errorResponse(`Internal server error: ${error}`));
    }
    if (!doc) {
      return res.json(errorResponse("Task not found"));
    }
    return res.json(successResponse(doc, "Task deleted"));
  });
}
