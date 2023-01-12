import { get } from "controllers/resources/cve.controller";
import express from "express";
const router = express.Router();

/* GET CVE from ID */
router.get("/:id", get);
export default router;
