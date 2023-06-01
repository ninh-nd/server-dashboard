import { create, get, getAll, update } from "../controllers/ticket.controller";
import express from "express";
import { checkPermission } from "../middlewares/permission";
const ticketRoute = express.Router();

ticketRoute.get("/", getAll);
ticketRoute.get("/:id", get);
ticketRoute.post("/", checkPermission("ticket:create"), create);
ticketRoute.patch("/:id", update);
export default ticketRoute;
