import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import type { AuthRequest } from "../types/index.js";

export async function getProjects(req: Request, res: Response) {
  const { status, managerId } = req.query;

  const projects = await prisma.project.findMany({
    where: {
      ...(status && { status: status as any }),
      ...(managerId && { managerId: managerId as string }),
    },
    include: {
      manager: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { deliveries: true, milestones: true } },
      deliveries: { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate progress for each project
  const result = projects.map((p) => {
    const total = p.deliveries.length;
    const completed = p.deliveries.filter((d) => d.status === "COMPLETED").length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const { deliveries: _, ...project } = p;
    return { ...project, progress };
  });

  res.json(result);
}

export async function getProjectById(req: Request, res: Response) {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id as string },
    include: {
      manager: { select: { id: true, name: true, avatarUrl: true } },
      deliveries: {
        include: {
          assignee: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { dueDate: "asc" },
      },
      milestones: { orderBy: { order: "asc" } },
    },
  });

  if (!project) {
    res.status(404).json({ error: "Proyecto no encontrado" });
    return;
  }

  res.json(project);
}

export async function createProject(req: AuthRequest, res: Response) {
  const project = await prisma.project.create({
    data: req.body,
    include: {
      manager: { select: { id: true, name: true } },
    },
  });

  req.app.get("io")?.emit("project:updated", project);
  res.status(201).json(project);
}

export async function updateProject(req: AuthRequest, res: Response) {
  const project = await prisma.project.update({
    where: { id: req.params.id as string },
    data: req.body,
    include: {
      manager: { select: { id: true, name: true } },
    },
  });

  req.app.get("io")?.emit("project:updated", project);
  res.json(project);
}

export async function deleteProject(req: Request, res: Response) {
  await prisma.project.delete({ where: { id: req.params.id as string } });
  res.json({ message: "Proyecto eliminado" });
}
