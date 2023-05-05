import {
  addThirdPartyToAccount,
  changePassword,
  create,
  get,
  getAll,
  getById,
  updateAccountInfo,
  remove,
  updateAccountPermission,
  updateGithubAccessToken,
} from "../controllers/account.controller";
import express from "express";
import { checkAuth, checkAdmin } from "../middlewares/auth";
const router = express.Router();
// Get an account
router.get("/", checkAuth, get);
// Get list of account
router.get("/list", checkAuth, checkAdmin, getAll);
// Get account by id
router.get("/:id", checkAuth, checkAdmin, getById);
// Create an account
router.post("/reg", create);
// Update general account info
router.patch("/:id", checkAuth, updateAccountInfo);
// Add a third party to an account
router.patch("/:id/thirdParty", addThirdPartyToAccount);
// Change password
router.patch("/:id/password", changePassword);
// Delete account
router.delete("/:id", checkAuth, checkAdmin, remove);
// Update account permission
router.patch("/:id/permission", checkAuth, checkAdmin, updateAccountPermission);
// Update Github's access token
router.patch("/:id/thirdParty/github", checkAuth, updateGithubAccessToken);
export default router;
