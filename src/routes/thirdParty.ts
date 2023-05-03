import express from "express";
import {
  getAll,
  get,
  create,
  update,
  remove,
} from "../controllers/thirdParty.controller";

const router = express.Router();

// Get all third parties
router.get("/", getAll);
// Get a third party
router.get("/:id", get);
// Create a third party
router.post("/", create);
// Update a third party
router.put("/:id", update);
// Remove a third party
router.delete("/:id", remove);

export default router;
