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
} from "../controllers/account.controller";
import express from "express";
import { checkAuth, checkAdmin } from "../middlewares/auth";
const accountRoute = express.Router();
accountRoute.get("/", checkAuth, get);
accountRoute.get("/list", checkAuth, checkAdmin, getAll);
accountRoute.get("/:id", checkAuth, checkAdmin, getById);
accountRoute.post("/reg", create);
accountRoute.patch("/:id", checkAuth, updateAccountInfo);
accountRoute.patch("/:id/password", changePassword);
accountRoute.delete("/:id", checkAuth, checkAdmin, remove);
accountRoute.patch(
  "/:id/permission",
  checkAuth,
  checkAdmin,
  updateAccountPermission
);
accountRoute.patch(
  "/:id/thirdParty/github",
  checkAuth,
  updateGithubAccessToken
);
export default accountRoute;
