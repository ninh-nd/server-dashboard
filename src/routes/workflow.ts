import express from "express";
import { getYaml } from "../controllers/workflow.controller";
const workflowRoute = express.Router();

workflowRoute.get("/", getYaml);

export default workflowRoute;
