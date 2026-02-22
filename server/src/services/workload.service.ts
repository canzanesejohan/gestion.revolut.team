import { prisma } from "../lib/prisma.js";
import { createNotification } from "./notification.service.js";

const MAX_ACTIVE_DELIVERIES = 5;
const DELAYED_THRESHOLD_PERCENT = 30;
const BLOCKED_HOURS_THRESHOLD = 48;

export async function detectBottlenecks(io?: any) {
  const alerts: string[] = [];

  // 1. Members with too many active deliveries
  const overloadedMembers = await prisma.user.findMany({
    where: {
      assignedDeliveries: {
        some: { status: { in: ["IN_PROGRESS", "IN_REVIEW"] } },
      },
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          assignedDeliveries: {
            where: { status: { in: ["IN_PROGRESS", "IN_REVIEW"] } },
          },
        },
      },
    },
  });

  for (const member of overloadedMembers) {
    if (member._count.assignedDeliveries > MAX_ACTIVE_DELIVERIES) {
      alerts.push(
        `${member.name}: ${member._count.assignedDeliveries} entregas activas`
      );
    }
  }

  // 2. Projects with high delay rate
  const projects = await prisma.project.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      name: true,
      managerId: true,
      deliveries: { select: { status: true } },
    },
  });

  for (const project of projects) {
    const total = project.deliveries.length;
    if (total === 0) continue;

    const delayed = project.deliveries.filter(
      (d) => d.status === "DELAYED"
    ).length;
    const pct = (delayed / total) * 100;

    if (pct > DELAYED_THRESHOLD_PERCENT) {
      await createNotification(
        {
          userId: project.managerId,
          type: "BOTTLENECK",
          title: "Cuello de botella detectado",
          message: `Proyecto "${project.name}": ${delayed}/${total} entregas retrasadas (${Math.round(pct)}%).`,
          sendTelegram: true,
        },
        io
      );
    }
  }

  // 3. Deliveries blocked for too long
  const blockedThreshold = new Date(
    Date.now() - BLOCKED_HOURS_THRESHOLD * 60 * 60 * 1000
  );

  const longBlocked = await prisma.delivery.findMany({
    where: {
      status: "BLOCKED",
      updatedAt: { lt: blockedThreshold },
    },
    include: {
      project: { select: { name: true, managerId: true } },
    },
  });

  for (const delivery of longBlocked) {
    await createNotification(
      {
        userId: delivery.project.managerId,
        type: "BLOCKER_ALERT",
        title: "Bloqueo prolongado",
        message: `"${delivery.title}" lleva bloqueada más de ${BLOCKED_HOURS_THRESHOLD}h en proyecto "${delivery.project.name}".`,
        deliveryId: delivery.id,
        sendTelegram: true,
      },
      io
    );
  }

  return { alerts, longBlocked: longBlocked.length };
}
