import express from "express";
import {
  get,
  create,
  update,
  remove,
  assignTask,
  joinProject,
} from "controllers/resources/member.controller";

const router = express.Router();

/* GET member */
router.get("/:id", get);
/* POST member */
router.post("/", create);
/* PUT member */
router.put("/:id", update);
/* DELETE member */
router.delete("/:id", remove);
/* PATCH member: Assign task */
router.patch("/:id/assignTask", assignTask);
/* PATCH member: Join project */
router.patch("/:id/joinProject", joinProject);
export default router;
