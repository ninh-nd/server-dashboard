import express from "express";
import { getWorkflows } from "../controllers/workflow.controller";
const workflowRoute = express.Router();

workflowRoute.get("/", getWorkflows);

export default workflowRoute;
