import type { Request, Response } from "express";
import type { AuthRequest } from "../types/index.js";
import * as templateService from "../services/template.service.js";

export async function getTemplates(req: Request, res: Response) {
  const templates = await templateService.getAllTemplates({
    category: req.query.category as any,
    isPublic: req.query.isPublic === "true" ? true : undefined,
  });
  res.json(templates);
}

export async function getTemplateById(req: Request, res: Response) {
  const template = await templateService.getTemplateById(req.params.id as string);
  if (!template) {
    res.status(404).json({ error: "Plantilla no encontrada" });
    return;
  }
  res.json(template);
}

export async function createTemplate(req: AuthRequest, res: Response) {
  const template = await templateService.createTemplate({
    ...req.body,
    createdById: req.user!.userId,
  });
  res.status(201).json(template);
}

export async function createFromTemplate(req: AuthRequest, res: Response) {
  const { templateId, name, description, startDate } = req.body;
  const project = await templateService.createProjectFromTemplate(templateId, {
    name,
    description,
    startDate: new Date(startDate),
    managerId: req.user!.userId,
  });
  res.status(201).json(project);
}
