import { create, getAll, get } from "../controllers/threat.controller";
import express from "express";
const threatRoute = express.Router();
threatRoute.get("/", getAll);
threatRoute.get("/:id", get);
threatRoute.post("/", create);
export default threatRoute;
