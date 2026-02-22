import type { DeliveryStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export async function getAllDeliveries(filters: {
  projectId?: string;
  assigneeId?: string;
  status?: DeliveryStatus;
  type?: string;
}) {
  return prisma.delivery.findMany({
    where: {
      ...(filters.projectId && { projectId: filters.projectId }),
      ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.type && { type: filters.type as any }),
    },
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      milestone: { select: { id: true, name: true } },
    },
    orderBy: { dueDate: "asc" },
  });
}

export async function getDeliveryById(id: string) {
  return prisma.delivery.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true, managerId: true } },
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      milestone: { select: { id: true, name: true } },
      logs: {
        include: { changedBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createDelivery(data: {
  title: string;
  description?: string;
  type?: any;
  priority?: any;
  projectId: string;
  assigneeId: string;
  milestoneId?: string;
  dueDate: Date;
}) {
  return prisma.delivery.create({
    data,
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
  });
}

export async function updateDelivery(id: string, data: Record<string, any>) {
  return prisma.delivery.update({
    where: { id },
    data,
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
  });
}

export async function changeDeliveryStatus(
  id: string,
  newStatus: DeliveryStatus,
  changedById: string,
  note?: string
) {
  const delivery = await prisma.delivery.findUniqueOrThrow({ where: { id } });
  const previousStatus = delivery.status;

  const [updated] = await prisma.$transaction([
    prisma.delivery.update({
      where: { id },
      data: {
        status: newStatus,
        ...(newStatus === "COMPLETED" && { completedAt: new Date(), progress: 100 }),
      },
      include: {
        project: { select: { id: true, name: true, managerId: true } },
        assignee: { select: { id: true, name: true } },
      },
    }),
    prisma.deliveryLog.create({
      data: {
        deliveryId: id,
        previousStatus,
        newStatus,
        changedById,
        note,
      },
    }),
  ]);

  return { delivery: updated, previousStatus, newStatus };
}

export async function getDeliveryStats() {
  const [total, byStatus, overdue] = await Promise.all([
    prisma.delivery.count(),
    prisma.delivery.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.delivery.count({
      where: {
        dueDate: { lt: new Date() },
        status: { notIn: ["COMPLETED", "DELAYED"] },
      },
    }),
  ]);

  const statusMap = Object.fromEntries(
    byStatus.map((s) => [s.status, s._count.status])
  );

  return {
    total,
    pending: statusMap.PENDING || 0,
    inProgress: statusMap.IN_PROGRESS || 0,
    inReview: statusMap.IN_REVIEW || 0,
    completed: statusMap.COMPLETED || 0,
    delayed: statusMap.DELAYED || 0,
    blocked: statusMap.BLOCKED || 0,
    overdue,
  };
}
