import { checkProjectManager, checkAuth } from "../../middlewares/auth";
import express from "express";
import {
  get,
  create,
  update,
  remove,
  addProjectOwn,
  getProjectOwn,
} from "controllers/resources/projectManager.controller";

const router = express.Router();
/* GET project manager projects */
router.get("/project", checkAuth, checkProjectManager, getProjectOwn);
/* GET project manager */
router.get("/:id", get);
/* POST project manager */
router.post("/", create);
/* PUT project manager */
router.put("/:id", update);
/* DELETE project manager */
router.delete("/:id", remove);
/* PATCH project manager: Add project to project manager */
router.patch("/:id/project", addProjectOwn);
export default router;
