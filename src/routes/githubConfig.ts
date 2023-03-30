import express from "express";
import { get, create, update } from "controllers/githubConfig.controller";

const router = express.Router();
// Get a github config
router.get("/:projectId", get);
// Create a github config
router.post("/", create);
// Update a github config
router.put("/:projectId", update);

export default router;
