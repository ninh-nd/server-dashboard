import express from "express";
const router = express.Router();
import { getAll, get } from "~/controllers/artifact.controller";

// Get all artifacts
router.get("/", getAll);
// Get an artifact
router.get("/:id", get);

export default router;
