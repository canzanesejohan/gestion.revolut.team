import type { Request, Response } from "express";
import type { AuthRequest } from "../types/index.js";
import * as reportService from "../services/report.service.js";

export async function getReportConfigs(_req: Request, res: Response) {
  const configs = await reportService.getReportConfigs();
  res.json(configs);
}

export async function createReportConfig(req: AuthRequest, res: Response) {
  const config = await reportService.createReportConfig({
    ...req.body,
    createdById: req.user!.userId,
  });
  res.status(201).json(config);
}

export async function generateReport(req: Request, res: Response) {
  const report = await reportService.generateReport(req.params.id as string);
  res.json(report);
}

export async function previewReport(req: Request, res: Response) {
  const report = await reportService.generateReport(req.params.id as string);
  res.json(report);
}
