import express from "express";
import permissions from "../utils/permission";
import { successResponse } from "../utils/responseFormat";
const router = express.Router();
router.get("/", (req, res) => {
  return res.json(
    successResponse(permissions, "Permissions fetched successfully")
  );
});
export default router;
