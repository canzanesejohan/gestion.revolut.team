import type { Request, Response } from "express";
import * as analyticsService from "../services/analytics.service.js";

export async function getVelocity(_req: Request, res: Response) {
  const data = await analyticsService.getVelocity();
  res.json(data);
}

export async function getCompliance(_req: Request, res: Response) {
  const data = await analyticsService.getCompliance();
  res.json(data);
}

export async function getAvgTime(_req: Request, res: Response) {
  const data = await analyticsService.getAvgTimeByType();
  res.json(data);
}

export async function getInsights(_req: Request, res: Response) {
  const data = await analyticsService.getInsights();
  res.json(data);
}

export async function getTeamStats(_req: Request, res: Response) {
  const data = await analyticsService.getTeamStats();
  res.json(data);
}
