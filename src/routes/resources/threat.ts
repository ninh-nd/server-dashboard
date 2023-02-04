import { create, getAll } from "controllers/resources/threat.controller";
import express from "express";
const router = express.Router();
/* GET all threats */
router.get("/", getAll);
/* POST threat */
router.post("/", create);
export default router;
