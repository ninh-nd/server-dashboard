import express from "express";
import {
  create,
  get,
  getAll,
  getSampleCode,
} from "../controllers/scanner.controller";
const scannerRoute = express.Router();

scannerRoute.get("/", getAll);

scannerRoute.post("/", create);

scannerRoute.get("/sample", getSampleCode);

scannerRoute.get("/:id", get);
export default scannerRoute;
