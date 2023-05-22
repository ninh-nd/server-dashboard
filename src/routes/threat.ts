import { create, getAll, get } from "../controllers/threat.controller";
import express from "express";
const threatRoute = express.Router();
// Get all threats
threatRoute.get("/", getAll);
// Get a threat
threatRoute.get("/:id", get);
// Create a threat
threatRoute.post("/", create);
export default threatRoute;
