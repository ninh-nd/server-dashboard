import { get } from "controllers/cwe.controller";
import express from "express";
const router = express.Router();

// Get a CWE from ID
router.get("/:id", get);
export default router;
