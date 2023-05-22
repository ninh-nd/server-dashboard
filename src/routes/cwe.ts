import { get } from "../controllers/cwe.controller";
import express from "express";
const cweRoute = express.Router();

// Get a CWE from ID
cweRoute.get("/:id", get);
export default cweRoute;
