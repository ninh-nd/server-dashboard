import express from "express";
const router = express.Router();
import { getAll, get, update } from "../controllers/artifact.controller";

// Get all artifacts
router.get("/", getAll);
// Get an artifact
router.get("/:id", get);
// Update an artifact
router.patch("/:id", update);
export default router;
