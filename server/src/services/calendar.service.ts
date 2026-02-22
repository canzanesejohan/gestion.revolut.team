import { prisma } from "../lib/prisma.js";

export async function getCalendarEvents(filters: {
  projectIds?: string[];
  assigneeId?: string;
  from?: string;
  to?: string;
}) {
  return prisma.delivery.findMany({
    where: {
      ...(filters.projectIds?.length && {
        projectId: { in: filters.projectIds },
      }),
      ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
      ...(filters.from &&
        filters.to && {
          dueDate: {
            gte: new Date(filters.from),
            lte: new Date(filters.to),
          },
        }),
    },
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
    orderBy: { dueDate: "asc" },
  });
}

export async function rescheduleDelivery(
  deliveryId: string,
  newDueDate: Date
) {
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: { dueDate: newDueDate },
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
  });
}

export async function getWorkloadByPeriod(from: string, to: string) {
  const deliveries = await prisma.delivery.findMany({
    where: {
      dueDate: { gte: new Date(from), lte: new Date(to) },
      status: { notIn: ["COMPLETED"] },
    },
    include: {
      assignee: { select: { id: true, name: true } },
    },
  });

  // Group by assignee
  const workload: Record<string, { name: string; count: number }> = {};
  for (const d of deliveries) {
    if (!workload[d.assigneeId]) {
      workload[d.assigneeId] = { name: d.assignee.name, count: 0 };
    }
    workload[d.assigneeId]!.count++;
  }

  return Object.entries(workload).map(([id, data]) => ({
    userId: id,
    ...data,
    overloaded: data.count > 5,
  }));
}
