import { create, getAll, get } from "../controllers/threat.controller";
import express from "express";
const router = express.Router();
// Get all threats
router.get("/", getAll);
// Get a threat
router.get("/:id", get);
// Create a threat
router.post("/", create);
export default router;
