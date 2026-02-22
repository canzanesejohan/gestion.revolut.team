import { prisma } from "../lib/prisma.js";
import { createNotification } from "./notification.service.js";

export async function checkDeadlines(io?: any) {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  // Mark overdue deliveries as DELAYED
  const overdueDeliveries = await prisma.delivery.findMany({
    where: {
      dueDate: { lt: now },
      status: { notIn: ["COMPLETED", "DELAYED"] },
    },
    include: {
      project: { select: { name: true, managerId: true } },
      assignee: { select: { id: true, name: true } },
    },
  });

  for (const delivery of overdueDeliveries) {
    await prisma.delivery.update({
      where: { id: delivery.id },
      data: { status: "DELAYED" },
    });

    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery.id,
        previousStatus: delivery.status,
        newStatus: "DELAYED",
        changedById: delivery.project.managerId,
        note: "Marcado automáticamente como retrasado",
      },
    });

    // Notify manager
    await createNotification(
      {
        userId: delivery.project.managerId,
        type: "DEADLINE_WARNING",
        title: "Entrega retrasada",
        message: `"${delivery.title}" ha superado su fecha límite. Asignado a ${delivery.assignee.name}.`,
        deliveryId: delivery.id,
        sendTelegram: true,
      },
      io
    );
  }

  // Warn about 24h deadlines
  const dueSoon24h = await prisma.delivery.findMany({
    where: {
      dueDate: { gte: now, lte: in24h },
      status: { notIn: ["COMPLETED", "DELAYED"] },
    },
    include: {
      project: { select: { name: true, managerId: true } },
      assignee: { select: { id: true, name: true } },
    },
  });

  for (const delivery of dueSoon24h) {
    // Notify assignee + manager
    for (const userId of [delivery.assigneeId, delivery.project.managerId]) {
      await createNotification(
        {
          userId,
          type: "DEADLINE_WARNING",
          title: "⏰ Deadline en 24h",
          message: `"${delivery.title}" vence en menos de 24 horas.`,
          deliveryId: delivery.id,
          sendTelegram: true,
        },
        io
      );
    }
  }

  // Warn about 48h deadlines (in-app only)
  const dueSoon48h = await prisma.delivery.findMany({
    where: {
      dueDate: { gt: in24h, lte: in48h },
      status: { notIn: ["COMPLETED", "DELAYED"] },
    },
    include: {
      assignee: { select: { id: true } },
    },
  });

  for (const delivery of dueSoon48h) {
    await createNotification(
      {
        userId: delivery.assigneeId,
        type: "DEADLINE_WARNING",
        title: "Deadline en 48h",
        message: `"${delivery.title}" vence en menos de 48 horas.`,
        deliveryId: delivery.id,
        sendTelegram: false,
      },
      io
    );
  }

  return {
    markedDelayed: overdueDeliveries.length,
    warned24h: dueSoon24h.length,
    warned48h: dueSoon48h.length,
  };
}
