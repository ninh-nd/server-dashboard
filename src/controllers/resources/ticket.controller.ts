import { Request, Response } from "express";
import { Ticket } from "models/ticket";
import { errorResponse, successResponse } from "utils/responseFormat";

export async function getAll(req: Request, res: Response) {
  const { projectName } = req.query;
  if (projectName === undefined) {
    return res.json(errorResponse("Project name is required"));
  }
  try {
    const tickets = await Ticket.find({ projectName: projectName });
    return res.json(successResponse(tickets, "Tickets fetched successfully"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
export async function create(req: Request, res: Response) {
  const { data } = req.body;
  try {
    const ticket = await Ticket.create(data);
    return res.json(successResponse(ticket, "Ticket created successfully"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
