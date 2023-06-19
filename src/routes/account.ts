import {
  changePassword,
  create,
  get,
  getAll,
  getById,
  updateAccountInfo,
  remove,
  updateAccountPermission,
  updateGithubAccessToken,
  disconnectFromGithub,
  disconnectFromGitlab,
  updateScannerPreference,
} from "../controllers/account.controller";
import express from "express";
import { checkAuth, checkAdmin } from "../middlewares/auth";
import passport from "passport";
const accountRoute = express.Router();
accountRoute.get("/", checkAuth, get);
accountRoute.get("/list", checkAuth, checkAdmin, getAll);
accountRoute.get("/:id", checkAuth, checkAdmin, getById);
accountRoute.post("/reg", create);
accountRoute.patch("/thirdParty/github", checkAuth, updateGithubAccessToken);
accountRoute.patch("/scanner", checkAuth, updateScannerPreference);
accountRoute.patch("/:id", checkAuth, updateAccountInfo);
accountRoute.patch("/:id/password", changePassword);
accountRoute.delete("/:id", checkAuth, checkAdmin, remove);
accountRoute.patch(
  "/:id/permission",
  checkAuth,
  checkAdmin,
  updateAccountPermission
);
accountRoute.get("/connect/github", passport.authenticate("github"));
accountRoute.get("/connect/gitlab", passport.authenticate("gitlab"));
accountRoute.patch("/disconnect/github", checkAuth, disconnectFromGithub);
accountRoute.patch("/disconnect/gitlab", checkAuth, disconnectFromGitlab);
export default accountRoute;
