import { prisma } from "../lib/prisma.js";
import * as analyticsService from "./analytics.service.js";

export async function generateReport(configId: string) {
  const config = await prisma.reportConfig.findUniqueOrThrow({
    where: { id: configId },
  });

  const projectIds = config.projectIds as string[];

  // Gather data
  const [velocity, compliance, avgTime, insights, teamStats] =
    await Promise.all([
      analyticsService.getVelocity(4),
      analyticsService.getCompliance(),
      analyticsService.getAvgTimeByType(),
      analyticsService.getInsights(),
      analyticsService.getTeamStats(),
    ]);

  // Project-specific stats
  const projects = await prisma.project.findMany({
    where: projectIds.length > 0 ? { id: { in: projectIds } } : { status: "ACTIVE" },
    include: {
      deliveries: { select: { status: true } },
      manager: { select: { name: true } },
    },
  });

  const projectSummaries = projects.map((p) => {
    const total = p.deliveries.length;
    const completed = p.deliveries.filter((d) => d.status === "COMPLETED").length;
    const delayed = p.deliveries.filter((d) => d.status === "DELAYED").length;

    return {
      name: p.name,
      manager: p.manager.name,
      total,
      completed,
      delayed,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  // Update last generated
  await prisma.reportConfig.update({
    where: { id: configId },
    data: { lastGeneratedAt: new Date() },
  });

  return {
    generatedAt: new Date().toISOString(),
    frequency: config.frequency,
    velocity,
    compliance,
    avgTime,
    insights,
    teamStats,
    projects: projectSummaries,
  };
}

export async function getReportConfigs() {
  return prisma.reportConfig.findMany({
    include: {
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createReportConfig(data: {
  name: string;
  frequency: "WEEKLY" | "MONTHLY";
  recipients: any;
  sections: any;
  projectIds: any;
  createdById: string;
}) {
  return prisma.reportConfig.create({ data });
}
