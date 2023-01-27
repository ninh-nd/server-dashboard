import { getAll } from "controllers/resources/threat.controller";
import express from "express";
const router = express.Router();
/* GET all threats */
router.get("/", getAll);
export default router;
