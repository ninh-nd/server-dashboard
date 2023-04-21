import express from "express";
import { successResponse } from "utils/responseFormat";
const router = express.Router();
const permissions = [
  "ticket:create",
  "ticket:read",
  "ticket:update",
  "ticket:delete",
  "task:create",
  "task:read",
  "task:update",
  "task:delete",
  "artifact:create",
  "artifact:read",
  "artifact:update",
  "artifact:delete",
  "phase:create",
  "phase:read",
  "phase:update",
  "phase:delete",
  "project:create",
  "project:read",
  "project:update",
  "project:delete",
  "user:create",
  "user:read",
  "user:update",
  "user:delete",
  "account:read",
  "account:update",
  "account:delete",
];
router.get("/", (req, res) => {
  return res.json(
    successResponse(permissions, "Permissions fetched successfully")
  );
});
export default router;
