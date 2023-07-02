import express from "express";
import { getChangeHistoryByObjectId } from "../controllers/changeHistory.controller";
const changeHistoryRoute = express.Router();
changeHistoryRoute.get("/", getChangeHistoryByObjectId);
export default changeHistoryRoute;
