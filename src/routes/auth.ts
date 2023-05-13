import { logout, redirectToHomePage } from "../controllers/auth.controller";
import express, { Response } from "express";
import passport from "passport";

const router = express.Router();
// Login
router.post("/login", passport.authenticate("local"), (req, res: Response) =>
  res.sendStatus(201)
);
// Logout
router.get("/logout", logout);
// Github login
router.get("/github", passport.authenticate("github", { scope: ["repo"] }));
// Github login success
router.get(
  "/github/callback",
  passport.authenticate("github"),
  redirectToHomePage
);

export default router;
