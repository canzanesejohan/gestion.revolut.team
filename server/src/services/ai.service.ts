import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../lib/prisma.js";

const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");
  return new Anthropic({ apiKey });
};

// Get a summary of the current system state for context
async function getSystemContext(): Promise<string> {
  const [projects, deliveryStats, users] = await Promise.all([
    prisma.project.findMany({
      where: { status: "ACTIVE" },
      include: {
        manager: { select: { name: true } },
        _count: { select: { deliveries: true } },
        deliveries: {
          select: { status: true, priority: true, dueDate: true },
        },
      },
    }),
    prisma.delivery.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.user.findMany({
      where: { isActive: true },
      select: {
        name: true,
        role: true,
        _count: {
          select: {
            assignedDeliveries: {
              where: { status: { in: ["IN_PROGRESS", "IN_REVIEW"] } },
            },
          },
        },
      },
    }),
  ]);

  const projectSummary = projects.map((p) => {
    const total = p.deliveries.length;
    const completed = p.deliveries.filter((d) => d.status === "COMPLETED").length;
    const delayed = p.deliveries.filter((d) => d.status === "DELAYED").length;
    const blocked = p.deliveries.filter((d) => d.status === "BLOCKED").length;
    return `- ${p.name} (Manager: ${p.manager.name}): ${completed}/${total} entregas completadas, ${delayed} retrasadas, ${blocked} bloqueadas`;
  }).join("\n");

  const statusSummary = deliveryStats.map((s) => `${s.status}: ${s._count}`).join(", ");

  const teamSummary = users.map((u) =>
    `- ${u.name} (${u.role}): ${u._count.assignedDeliveries} entregas activas`
  ).join("\n");

  return `
ESTADO ACTUAL DEL SISTEMA:

PROYECTOS ACTIVOS:
${projectSummary || "No hay proyectos activos"}

ENTREGAS POR ESTADO: ${statusSummary || "Sin entregas"}

EQUIPO:
${teamSummary || "Sin miembros"}

Fecha actual: ${new Date().toISOString().split("T")[0]}
`.trim();
}

// General AI chat - answers questions, gives recommendations
export async function chatWithAI(message: string, history: { role: "user" | "assistant"; content: string }[] = []): Promise<string> {
  const client = getClient();
  const context = await getSystemContext();

  const systemPrompt = `Eres el asistente de IA de "Revolut Team", una plataforma de gestion de productividad para equipos de desarrollo de software. Tu nombre es "Claude Assistant".

Tu rol:
- Ayudar a gestionar proyectos, entregas y equipo
- Dar recomendaciones basadas en datos reales del sistema
- Responder en espanol
- Ser conciso, profesional y orientado a acciones
- Cuando sugiras crear algo, da instrucciones claras

${context}

Puedes ayudar con:
1. Analizar el estado de proyectos y entregas
2. Recomendar prioridades y asignaciones
3. Detectar riesgos y cuellos de botella
4. Sugerir mejoras en la productividad
5. Generar planes de proyecto
6. Responder preguntas sobre el equipo y su carga de trabajo`;

  const messages = [
    ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
    { role: "user" as const, content: message },
  ];

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "No pude generar una respuesta.";
}

// Generate a project plan from a description
export async function generateProjectPlan(description: string): Promise<{
  name: string;
  description: string;
  milestones: { name: string; description: string; durationDays: number }[];
  deliveries: { title: string; type: string; priority: string; description: string; milestoneName: string }[];
}> {
  const client = getClient();
  const context = await getSystemContext();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: `Eres un experto en gestion de proyectos de software. Genera planes detallados en formato JSON.

${context}

Responde SOLO con JSON valido, sin markdown ni texto adicional. El JSON debe seguir este esquema exacto:
{
  "name": "Nombre del proyecto",
  "description": "Descripcion breve",
  "milestones": [
    { "name": "Nombre del hito", "description": "Descripcion", "durationDays": 14 }
  ],
  "deliveries": [
    { "title": "Titulo", "type": "FEATURE|BUG_FIX|DOCUMENTATION|DESIGN|RESEARCH|OTHER", "priority": "LOW|MEDIUM|HIGH|CRITICAL", "description": "Descripcion", "milestoneName": "Nombre del hito al que pertenece" }
  ]
}

Tipos validos: FEATURE, BUG_FIX, DOCUMENTATION, DESIGN, RESEARCH, OTHER
Prioridades validas: LOW, MEDIUM, HIGH, CRITICAL`,
    messages: [
      { role: "user", content: `Genera un plan de proyecto detallado para: ${description}` },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) throw new Error("No response from AI");

  return JSON.parse(textBlock.text);
}

// Generate insights about current state
export async function generateAIInsights(): Promise<string> {
  const client = getClient();
  const context = await getSystemContext();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: "Eres un analista de productividad experto. Analiza los datos y genera insights accionables en espanol. Se conciso y directo. Usa viñetas.",
    messages: [
      { role: "user", content: `Analiza el estado actual del equipo y genera recomendaciones:\n\n${context}` },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "No se pudieron generar insights.";
}

// Suggest delivery assignments based on team workload
export async function suggestAssignment(deliveryTitle: string, deliveryType: string): Promise<string> {
  const client = getClient();
  const context = await getSystemContext();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: `Eres un asistente de asignacion de tareas. Basandote en la carga de trabajo actual del equipo, sugiere la mejor persona para esta entrega. Responde en espanol, se breve y justifica.

${context}`,
    messages: [
      { role: "user", content: `Sugiere la mejor persona para asignar: "${deliveryTitle}" (Tipo: ${deliveryType})` },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "No se pudo generar sugerencia.";
}
