import {
  addThirdPartyToAccount,
  changePassword,
  create,
  get,
} from "controllers/account.controller";
import express from "express";
import { checkAuth } from "middlewares/auth";
const router = express.Router();
// Get an account
router.get("/", checkAuth, get);
// Create an account
router.post("/reg", create);
// Add a third party to an account
router.patch("/:id/thirdParty", addThirdPartyToAccount);
// Change password
router.patch("/:id/password", changePassword);
export default router;
