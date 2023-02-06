import { create, getAll } from "controllers/resources/ticket.controller";
import express from "express";
const router = express.Router();

// Get all tickets
router.get("/", getAll);
// Create a ticket
router.post("/", create);
export default router;
