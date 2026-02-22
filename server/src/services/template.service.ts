import { prisma } from "../lib/prisma.js";
import type { TemplateCategory } from "@prisma/client";

export async function getAllTemplates(filters: {
  category?: TemplateCategory;
  isPublic?: boolean;
}) {
  return prisma.projectTemplate.findMany({
    where: {
      ...(filters.category && { category: filters.category }),
      ...(filters.isPublic !== undefined && { isPublic: filters.isPublic }),
    },
    include: {
      createdBy: { select: { id: true, name: true } },
      milestones: { orderBy: { order: "asc" } },
    },
    orderBy: { usageCount: "desc" },
  });
}

export async function getTemplateById(id: string) {
  return prisma.projectTemplate.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true } },
      milestones: { orderBy: { order: "asc" } },
    },
  });
}

export async function createTemplate(data: {
  name: string;
  description?: string;
  category: TemplateCategory;
  isPublic: boolean;
  createdById: string;
  milestones: {
    name: string;
    description?: string;
    relativeDueDay: number;
    order: number;
    deliveries: any;
  }[];
}) {
  const { milestones, ...templateData } = data;

  return prisma.projectTemplate.create({
    data: {
      ...templateData,
      milestones: {
        create: milestones,
      },
    },
    include: {
      milestones: { orderBy: { order: "asc" } },
    },
  });
}

export async function createProjectFromTemplate(
  templateId: string,
  projectData: {
    name: string;
    description?: string;
    startDate: Date;
    managerId: string;
  }
) {
  const template = await prisma.projectTemplate.findUniqueOrThrow({
    where: { id: templateId },
    include: { milestones: { orderBy: { order: "asc" } } },
  });

  const startDate = projectData.startDate;

  // Calculate end date from last milestone
  const lastMilestone = template.milestones[template.milestones.length - 1];
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (lastMilestone?.relativeDueDay ?? 30));

  const project = await prisma.project.create({
    data: {
      name: projectData.name,
      description: projectData.description ?? template.description,
      startDate,
      endDate,
      managerId: projectData.managerId,
      templateId,
    },
  });

  // Create milestones with calculated dates
  for (const ms of template.milestones) {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + ms.relativeDueDay);

    await prisma.milestone.create({
      data: {
        name: ms.name,
        description: ms.description,
        projectId: project.id,
        dueDate,
        order: ms.order,
      },
    });
  }

  // Increment usage count
  await prisma.projectTemplate.update({
    where: { id: templateId },
    data: { usageCount: { increment: 1 } },
  });

  return project;
}
