import { get } from "controllers/resources/cwe.controller";
import express from "express";
const router = express.Router();

/* GET CWE from ID */
router.get("/:id", get);
export default router;
