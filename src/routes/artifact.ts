import express from "express";
const artifactRoute = express.Router();
import { getAll, get, update } from "../controllers/artifact.controller";

// Get all artifacts
artifactRoute.get("/", getAll);
// Get an artifact
artifactRoute.get("/:id", get);
// Update an artifact
artifactRoute.patch("/:id", update);
export default artifactRoute;
