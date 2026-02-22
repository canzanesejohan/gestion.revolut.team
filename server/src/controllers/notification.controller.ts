import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import * as notifService from "../services/notification.service.js";

export async function getNotifications(req: AuthRequest, res: Response) {
  const notifications = await notifService.getUserNotifications(req.user!.userId);
  res.json(notifications);
}

export async function markAsRead(req: AuthRequest, res: Response) {
  const notification = await notifService.markAsRead(req.params.id);
  res.json(notification);
}

export async function markAllAsRead(req: AuthRequest, res: Response) {
  await notifService.markAllAsRead(req.user!.userId);
  res.json({ message: "Todas marcadas como leídas" });
}

export async function getUnreadCount(req: AuthRequest, res: Response) {
  const count = await notifService.getUnreadCount(req.user!.userId);
  res.json({ count });
}
