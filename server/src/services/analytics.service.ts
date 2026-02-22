import { prisma } from "../lib/prisma.js";

export async function getVelocity(weeks = 8) {
  const data: { week: string; completed: number }[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - (i + 1) * 7);
    const end = new Date();
    end.setDate(end.getDate() - i * 7);

    const count = await prisma.delivery.count({
      where: {
        completedAt: { gte: start, lt: end },
      },
    });

    data.push({
      week: start.toISOString().split("T")[0]!,
      completed: count,
    });
  }

  return data;
}

export async function getCompliance() {
  const completed = await prisma.delivery.findMany({
    where: { status: "COMPLETED" },
    select: { dueDate: true, completedAt: true },
  });

  const total = completed.length;
  if (total === 0) return { rate: 0, onTime: 0, late: 0, total: 0 };

  const onTime = completed.filter(
    (d) => d.completedAt && d.completedAt <= d.dueDate
  ).length;

  return {
    rate: Math.round((onTime / total) * 100),
    onTime,
    late: total - onTime,
    total,
  };
}

export async function getAvgTimeByType() {
  const completed = await prisma.delivery.findMany({
    where: { status: "COMPLETED", completedAt: { not: null } },
    select: { type: true, createdAt: true, completedAt: true },
  });

  const byType: Record<string, { total: number; count: number }> = {};

  for (const d of completed) {
    if (!d.completedAt) continue;
    const days =
      (d.completedAt.getTime() - d.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (!byType[d.type]) byType[d.type] = { total: 0, count: 0 };
    byType[d.type]!.total += days;
    byType[d.type]!.count += 1;
  }

  return Object.entries(byType).map(([type, { total, count }]) => ({
    type,
    avgDays: Math.round((total / count) * 10) / 10,
    count,
  }));
}

export async function getInsights() {
  const insights: { type: string; message: string }[] = [];

  // Velocity trend
  const velocity = await getVelocity(4);
  if (velocity.length >= 2) {
    const current = velocity[velocity.length - 1]!.completed;
    const previous = velocity[velocity.length - 2]!.completed;
    if (previous > 0) {
      const change = Math.round(((current - previous) / previous) * 100);
      if (change > 0) {
        insights.push({
          type: "positive",
          message: `La velocidad de entrega aumento ${change}% esta semana respecto a la anterior.`,
        });
      } else if (change < -10) {
        insights.push({
          type: "warning",
          message: `La velocidad de entrega bajo ${Math.abs(change)}% esta semana.`,
        });
      }
    }
  }

  // Compliance
  const compliance = await getCompliance();
  if (compliance.rate < 70) {
    insights.push({
      type: "critical",
      message: `Solo el ${compliance.rate}% de las entregas se completan a tiempo. Revisar estimaciones.`,
    });
  }

  // Blocked deliveries
  const blockedCount = await prisma.delivery.count({
    where: { status: "BLOCKED" },
  });
  if (blockedCount > 0) {
    insights.push({
      type: "warning",
      message: `Hay ${blockedCount} entregas bloqueadas que requieren atencion.`,
    });
  }

  // Avg mood from checkins this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const moodAvg = await prisma.checkin.aggregate({
    where: { createdAt: { gte: weekAgo } },
    _avg: { mood: true },
  });

  if (moodAvg._avg.mood && moodAvg._avg.mood < 3) {
    insights.push({
      type: "warning",
      message: `El mood promedio del equipo es ${moodAvg._avg.mood.toFixed(1)}/5. Considerar una reunion de equipo.`,
    });
  }

  return insights;
}

export async function getTeamStats() {
  const members = await prisma.user.findMany({
    where: { isActive: true, role: { not: "ADMIN" } },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      _count: {
        select: {
          assignedDeliveries: { where: { status: "COMPLETED" } },
        },
      },
      assignedDeliveries: {
        where: { status: { in: ["IN_PROGRESS", "IN_REVIEW"] } },
        select: { id: true },
      },
    },
  });

  return members.map((m) => ({
    id: m.id,
    name: m.name,
    avatarUrl: m.avatarUrl,
    completed: m._count.assignedDeliveries,
    active: m.assignedDeliveries.length,
  }));
}
