import { Request, Response } from "express";
import { Member } from "models/member";
import { ProjectManager } from "models/projectManager";
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
  const { assigner } = data;
  if (assigner === undefined) {
    return res.json(errorResponse("Assigner is required"));
  }
  try {
    const member = await Member.findOne({ account: assigner });
    const pm = await ProjectManager.findOne({ account: assigner });
    let o;
    if (member) {
      o = { ...data, roleModel: "Member", assigner: member._id };
    }
    if (pm) {
      o = { ...data, roleModel: "ProjectManager", assigner: pm._id };
    } else {
      return res.json(errorResponse("Assigner does not exist"));
    }
    const ticket = await Ticket.create(o);
    return res.json(successResponse(ticket, "Ticket created successfully"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}
