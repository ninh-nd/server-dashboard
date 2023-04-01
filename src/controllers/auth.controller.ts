import { errorResponse, successResponse } from "utils/responseFormat";
import { Request, Response } from "express";

export async function logout(req: Request, res: Response) {
  req.logout((err) => {
    if (err) {
      return res.json(errorResponse(err));
    }
  });
  return res.json(successResponse(null, "Logged out"));
}
export async function redirectToHomePage(req: Request, res: Response) {}
