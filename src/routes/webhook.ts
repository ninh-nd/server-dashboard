import express from "express";
import {
  importVulnToImage,
  receiveGithubScanResult,
  triggerGithubScan,
} from "../controllers/webhook.controller";
const router = express.Router();

// Listening to image scan
router.post("/image", importVulnToImage);
// Trigger a repo scan
router.post("/code/github", triggerGithubScan);
// Listening to repo scan
router.post("/code/github", receiveGithubScanResult);
export default router;
