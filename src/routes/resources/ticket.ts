import {
  create,
  get,
  getAll,
  update,
} from "controllers/resources/ticket.controller";
import express from "express";
const router = express.Router();

// Get all tickets
router.get("/", getAll);
// Get a ticket
router.get("/:id", get);
// Create a ticket
router.post("/", create);
// Update a ticket
router.patch("/:id", update);
export default router;
