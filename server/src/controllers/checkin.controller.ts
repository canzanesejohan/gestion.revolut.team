import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import type { AuthRequest } from "../types/index.js";

export async function getCheckins(req: Request, res: Response) {
  const { userId, projectId, from, to } = req.query;

  const checkins = await prisma.checkin.findMany({
    where: {
      ...(userId && { userId: userId as string }),
      ...(projectId && { projectId: projectId as string }),
      ...(from &&
        to && {
          date: {
            gte: new Date(from as string),
            lte: new Date(to as string),
          },
        }),
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      project: { select: { id: true, name: true } },
      blockers: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(checkins);
}

export async function createCheckin(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const { projectId, accomplished, planned, mood, blockers } = req.body;

  const checkin = await prisma.checkin.create({
    data: {
      userId,
      projectId,
      accomplished,
      planned,
      mood,
      blockers: {
        create: blockers.map((b: { description: string }) => ({
          description: b.description,
        })),
      },
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      project: { select: { id: true, name: true } },
      blockers: true,
    },
  });

  const io = req.app.get("io");
  io?.emit("checkin:new", checkin);

  res.status(201).json(checkin);
}

export async function getCheckinSummary(req: Request, res: Response) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayCheckins, totalMembers, blockers] = await Promise.all([
    prisma.checkin.count({ where: { date: { gte: today } } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.checkinBlocker.count({ where: { isResolved: false } }),
  ]);

  const avgMood = await prisma.checkin.aggregate({
    where: { date: { gte: today } },
    _avg: { mood: true },
  });

  res.json({
    todayCheckins,
    totalMembers,
    completionRate: totalMembers > 0 ? Math.round((todayCheckins / totalMembers) * 100) : 0,
    avgMood: avgMood._avg.mood || 0,
    unresolvedBlockers: blockers,
  });
}

export async function getBlockers(req: Request, res: Response) {
  const blockers = await prisma.checkinBlocker.findMany({
    where: { isResolved: false },
    include: {
      checkin: {
        include: {
          user: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(blockers);
}

export async function resolveBlocker(req: Request, res: Response) {
  const blocker = await prisma.checkinBlocker.update({
    where: { id: req.params.id as string },
    data: { isResolved: true, resolvedAt: new Date() },
  });
  res.json(blocker);
}
