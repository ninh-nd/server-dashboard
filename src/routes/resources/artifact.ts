import express from "express";
const router = express.Router();
import { getAll, create } from "controllers/resources/artifact.controller";

/* GET all artifacts */
router.get("/", getAll);
/* POST artifact */
router.post("/", create);
