import express from "express";
import {
  getAll,
  get,
  create,
  update,
  remove,
  getReposFromGithub,
} from "../controllers/thirdParty.controller";

const thirdPartyRoute = express.Router();

// Get all third parties
thirdPartyRoute.get("/", getAll);
// Get a third party
thirdPartyRoute.get("/:id", get);
// Create a third party
thirdPartyRoute.post("/", create);
// Update a third party
thirdPartyRoute.put("/:id", update);
// Remove a third party
thirdPartyRoute.delete("/:id", remove);
// Get a list of repos from Github
thirdPartyRoute.get("/github/repo", getReposFromGithub);
export default thirdPartyRoute;
