import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import type { AuthRequest } from "../types/index.js";
import bcrypt from "bcryptjs";

const router = Router();

router.use(authenticate);

// List all users
router.get("/", async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      telegramChatId: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          assignedDeliveries: { where: { status: { in: ["IN_PROGRESS", "IN_REVIEW"] } } },
        },
      },
    },
    orderBy: { name: "asc" },
  });
  res.json(users);
});

// Create user (ADMIN only)
router.post("/", authorize("ADMIN"), async (req: Request, res: Response) => {
  const { name, email, password, role, phone } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role, phone },
    select: { id: true, name: true, email: true, role: true },
  });
  res.status(201).json(user);
});

// Update user
router.put("/:id", async (req: AuthRequest, res: Response) => {
  const { name, email, phone, telegramChatId, role } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id as string },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone !== undefined && { phone }),
      ...(telegramChatId !== undefined && { telegramChatId }),
      ...(role && req.user?.role === "ADMIN" && { role }),
    },
    select: { id: true, name: true, email: true, role: true, telegramChatId: true },
  });
  res.json(user);
});

// Get user workload
router.get("/:id/workload", async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const deliveries = await prisma.delivery.findMany({
    where: { assigneeId: userId, status: { notIn: ["COMPLETED"] } },
    include: {
      project: { select: { name: true } },
    },
    orderBy: { dueDate: "asc" },
  });
  res.json({
    active: deliveries.length,
    deliveries,
  });
});

export default router;
