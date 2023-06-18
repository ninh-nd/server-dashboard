import { Request, Response } from "express";
import { ScannerModel } from "../models/models";
import { errorResponse, successResponse } from "../utils/responseFormat";
import {
  generateDockerfile,
  sampleCode,
  vulnInterface,
} from "../utils/generateDockerfile";

export async function getAll(req: Request, res: Response) {
  try {
    const scanners = await ScannerModel.find();
    return res.json(successResponse(scanners, "Scanners found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  const { data } = req.body;
  try {
    await ScannerModel.create({
      name: data.name,
      createdBy: req.user?.username,
      config: data.config,
    });
    const dockerfile = await generateDockerfile(data.config);
    return res.json(successResponse(dockerfile, "Scanner created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function getSampleCode(req: Request, res: Response) {
  return res.json(
    successResponse(
      {
        interface: vulnInterface,
        sampleCode: sampleCode,
      },
      "Sample code found"
    )
  );
}
