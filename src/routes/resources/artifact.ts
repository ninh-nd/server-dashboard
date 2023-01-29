import express from "express";
const router = express.Router();
import { getAll, get } from "controllers/resources/artifact.controller";

/* GET all artifacts */
router.get("/", getAll);
/* GET artifact */
router.get("/:id", get);

export default router;
