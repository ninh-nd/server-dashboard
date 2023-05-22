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
const accountRoute = express.Router();
// Get account info using session
accountRoute.get("/", checkAuth, get);
// Get list of account
accountRoute.get("/list", checkAuth, checkAdmin, getAll);
// Get account by id
accountRoute.get("/:id", checkAuth, checkAdmin, getById);
// Create an account
accountRoute.post("/reg", create);
// Update general account info
accountRoute.patch("/:id", checkAuth, updateAccountInfo);
// Add a third party to an account
accountRoute.patch("/:id/thirdParty", addThirdPartyToAccount);
// Change password
accountRoute.patch("/:id/password", changePassword);
// Delete account
accountRoute.delete("/:id", checkAuth, checkAdmin, remove);
// Update account permission
accountRoute.patch(
  "/:id/permission",
  checkAuth,
  checkAdmin,
  updateAccountPermission
);
// Update Github's access token
accountRoute.patch(
  "/:id/thirdParty/github",
  checkAuth,
  updateGithubAccessToken
);
export default accountRoute;
