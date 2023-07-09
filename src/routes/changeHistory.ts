import express from "express";
import {
  getAdminChangeHistory,
  getChangeHistoryByObjectId,
} from "../controllers/changeHistory.controller";
const changeHistoryRoute = express.Router();
changeHistoryRoute.get("/:objectId", getChangeHistoryByObjectId);
changeHistoryRoute.get("/", getAdminChangeHistory);
export default changeHistoryRoute;
