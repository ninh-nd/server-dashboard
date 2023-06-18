import express from "express";
import {
  create,
  getAll,
  getSampleCode,
} from "../controllers/scanner.controller";
const scannerRoute = express.Router();

scannerRoute.get("/", getAll);

scannerRoute.post("/", create);

scannerRoute.get("/sample", getSampleCode);

export default scannerRoute;
