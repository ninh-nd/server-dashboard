import { NextFunction, Response, Request } from "express";
import { errorResponse } from "utils/responseFormat";

function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send(errorResponse("You are not authenticated"));
}
export { checkAuth };
