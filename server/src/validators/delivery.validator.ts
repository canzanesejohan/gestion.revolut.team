import { z } from "zod";

export const createDeliverySchema = z.object({
  title: z.string().min(1, "Título requerido"),
  description: z.string().optional(),
  type: z.enum(["FEATURE", "BUG_FIX", "DOCUMENTATION", "DESIGN", "RESEARCH", "OTHER"]).default("FEATURE"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  projectId: z.string().min(1),
  assigneeId: z.string().min(1),
  milestoneId: z.string().optional(),
  dueDate: z.string().transform((s) => new Date(s)),
});

export const updateDeliverySchema = createDeliverySchema.partial();

export const changeStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "IN_REVIEW", "COMPLETED", "DELAYED", "BLOCKED"]),
  note: z.string().optional(),
});
