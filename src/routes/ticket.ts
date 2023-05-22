import { create, get, getAll, update } from "../controllers/ticket.controller";
import express from "express";
import { checkPermission } from "../middlewares/permission";
const ticketRoute = express.Router();

// Get all tickets
ticketRoute.get("/", getAll);
// Get a ticket
ticketRoute.get("/:id", get);
// Create a ticket
ticketRoute.post("/", checkPermission("ticket:create"), create);
// Update a ticket
ticketRoute.patch("/:id", update);
export default ticketRoute;
