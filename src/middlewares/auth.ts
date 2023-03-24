import { NextFunction, Response, Request } from "express";
import { IAccount } from "models/interfaces";
import getRole from "utils/account";
import { errorResponse } from "utils/responseFormat";

function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send(errorResponse("You are not authenticated"));
}

function checkProjectManager(req: Request, res: Response, next: NextFunction) {
  const account = req.user as IAccount;
  getRole(account._id).then((roleObject) => {
    if (!roleObject)
      return res.status(500).send(errorResponse("Error getting role of user"));
    if (roleObject.role === "manager") {
      return next();
    }
    return res.status(403).send(errorResponse("You are not authorized"));
  });
}

export { checkAuth, checkProjectManager };
