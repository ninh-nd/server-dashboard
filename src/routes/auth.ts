import { logout, redirectToHomePage } from "../controllers/auth.controller";
import express, { Response } from "express";
import passport from "passport";

const authRoute = express.Router();
// Login
authRoute.post("/login", passport.authenticate("local"), (req, res: Response) =>
  res.sendStatus(201)
);
// Logout
authRoute.get("/logout", logout);
// Github login
authRoute.get("/github", passport.authenticate("github", { scope: ["repo"] }));
// Github login success
authRoute.get(
  "/github/callback",
  passport.authenticate("github"),
  redirectToHomePage
);
// Gitlab login
authRoute.get(
  "/gitlab",
  passport.authenticate("gitlab", {
    scope: ["api", "read_user", "read_repository"],
  })
);
// Gitlab login success
authRoute.get(
  "/gitlab/callback",
  passport.authenticate("gitlab"),
  redirectToHomePage
);

export default authRoute;
