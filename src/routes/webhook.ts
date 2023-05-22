import express from "express";
import { importVulnToImage } from "../controllers/webhook.controller";
const webhookRoute = express.Router();

// Listening to image scan
webhookRoute.post("/image", importVulnToImage);

export default webhookRoute;
