import type { NotificationType } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { sendTelegramMessage } from "./telegram.service.js";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  deliveryId?: string;
  sendTelegram?: boolean;
}

export async function createNotification(
  params: CreateNotificationParams,
  io?: any
) {
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      deliveryId: params.deliveryId,
      channel: params.sendTelegram ? "TELEGRAM" : "IN_APP",
    },
  });

  // Emit via Socket.io
  if (io) {
    io.to(`user:${params.userId}`).emit("notification:new", notification);
  }

  // Send Telegram if requested
  if (params.sendTelegram) {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { telegramChatId: true },
    });

    if (user?.telegramChatId) {
      await sendTelegramMessage(
        user.telegramChatId,
        `*${params.title}*\n${params.message}`
      );
    }
  }

  return notification;
}

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}
