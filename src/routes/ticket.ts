import { create, get, getAll, update } from "../controllers/ticket.controller";
import express from "express";
import { checkPermission } from "../middlewares/permission";
const router = express.Router();

// Get all tickets
router.get("/", getAll);
// Get a ticket
router.get("/:id", get);
// Create a ticket
router.post("/", checkPermission("ticket:create"), create);
// Update a ticket
router.patch("/:id", update);
export default router;
