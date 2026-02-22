import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@revolut.team" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@revolut.team",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create manager user
  const managerPassword = await bcrypt.hash("manager123", 10);
  const manager = await prisma.user.upsert({
    where: { email: "manager@revolut.team" },
    update: {},
    create: {
      name: "Carlos Manager",
      email: "manager@revolut.team",
      password: managerPassword,
      role: "MANAGER",
    },
  });

  // Create member users
  const memberPassword = await bcrypt.hash("member123", 10);
  const member1 = await prisma.user.upsert({
    where: { email: "ana@revolut.team" },
    update: {},
    create: {
      name: "Ana García",
      email: "ana@revolut.team",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: "luis@revolut.team" },
    update: {},
    create: {
      name: "Luis Martínez",
      email: "luis@revolut.team",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  // Create a demo project
  const project = await prisma.project.create({
    data: {
      name: "App Mobile v2.0",
      description: "Rediseño completo de la aplicación móvil",
      status: "ACTIVE",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-04-30"),
      managerId: manager.id,
    },
  });

  // Create milestones
  const milestone1 = await prisma.milestone.create({
    data: {
      name: "Discovery & Diseño",
      projectId: project.id,
      dueDate: new Date("2026-02-28"),
      status: "IN_PROGRESS",
      order: 1,
    },
  });

  const milestone2 = await prisma.milestone.create({
    data: {
      name: "Desarrollo Core",
      projectId: project.id,
      dueDate: new Date("2026-03-31"),
      status: "PENDING",
      order: 2,
    },
  });

  // Create deliveries
  await prisma.delivery.createMany({
    data: [
      {
        title: "Research de usuarios",
        description: "Entrevistas y encuestas a usuarios actuales",
        status: "COMPLETED",
        type: "RESEARCH",
        priority: "HIGH",
        progress: 100,
        projectId: project.id,
        assigneeId: member1.id,
        milestoneId: milestone1.id,
        dueDate: new Date("2026-02-15"),
        completedAt: new Date("2026-02-14"),
      },
      {
        title: "Wireframes UI/UX",
        description: "Diseño de wireframes para las principales pantallas",
        status: "IN_PROGRESS",
        type: "DESIGN",
        priority: "HIGH",
        progress: 60,
        projectId: project.id,
        assigneeId: member1.id,
        milestoneId: milestone1.id,
        dueDate: new Date("2026-02-25"),
      },
      {
        title: "API de autenticación",
        description: "Implementar login, registro y refresh tokens",
        status: "IN_PROGRESS",
        type: "FEATURE",
        priority: "CRITICAL",
        progress: 40,
        projectId: project.id,
        assigneeId: member2.id,
        milestoneId: milestone2.id,
        dueDate: new Date("2026-03-10"),
      },
      {
        title: "Integración pasarela de pagos",
        description: "Conectar con Stripe para pagos in-app",
        status: "PENDING",
        type: "FEATURE",
        priority: "HIGH",
        progress: 0,
        projectId: project.id,
        assigneeId: member2.id,
        milestoneId: milestone2.id,
        dueDate: new Date("2026-03-25"),
      },
      {
        title: "Documentación API",
        description: "Swagger/OpenAPI spec para todos los endpoints",
        status: "PENDING",
        type: "DOCUMENTATION",
        priority: "MEDIUM",
        progress: 0,
        projectId: project.id,
        assigneeId: member1.id,
        milestoneId: milestone2.id,
        dueDate: new Date("2026-03-31"),
      },
    ],
  });

  console.log("✅ Seed completado:");
  console.log(`   → Admin: admin@revolut.team / admin123`);
  console.log(`   → Manager: manager@revolut.team / manager123`);
  console.log(`   → Member: ana@revolut.team / member123`);
  console.log(`   → Member: luis@revolut.team / member123`);
  console.log(`   → Proyecto: ${project.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
