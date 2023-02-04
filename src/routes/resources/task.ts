import express from "express";
import {
  get,
  getAll,
  create,
  markTask,
  remove,
} from "controllers/resources/task.controller";
import { checkAuth } from "middlewares/auth";

const router = express.Router();

/* GET all tasks */
router.get("/", checkAuth, getAll);
/* GET task */
router.get("/:id", checkAuth, get);
/* POST task */
router.post("/", checkAuth, create);
/* PUT task: Change status of tasks */
router.patch("/", checkAuth, markTask);
/* DELETE task */
router.delete("/:id", checkAuth, remove);

export default router;
