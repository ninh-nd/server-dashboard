import { Request, Response } from "express";
import { TicketModel, UserModel } from "../models/models";
import { errorResponse, successResponse } from "../utils/responseFormat";

export async function getAll(req: Request, res: Response) {
  const { projectName } = req.query;
  if (!projectName) {
    return res.json(errorResponse("Project name is required"));
  }
  try {
    const tickets = await TicketModel.find({ projectName: projectName });
    return res.json(successResponse(tickets, "Tickets fetched successfully"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function get(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const ticket = await TicketModel.findById(id).populate({
      path: "assignee assigner targetedVulnerability",
    });
    if (ticket) {
      return res.json(successResponse(ticket, "Ticket fetched successfully"));
    } else {
      return res.json(errorResponse("Ticket does not exist"));
    }
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  const { data } = req.body;
  const { assigner } = data;
  if (!assigner) {
    return res.json(errorResponse("Assigner is required"));
  }
  try {
    const user = await UserModel.findOne({ account: assigner });
    if (user) {
      const o = { ...data, assigner: user._id };
      const ticket = await TicketModel.create(o);
      return res.json(successResponse(ticket, "Ticket created successfully"));
    } else {
      return res.json(errorResponse("Assigner does not exist"));
    }
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { data } = req.body;
  try {
    const ticket = await TicketModel.findByIdAndUpdate(id, data, { new: true });
    if (ticket) {
      return res.json(successResponse(ticket, "Ticket updated successfully"));
    }
    return res.json(errorResponse("Ticket does not exist"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
