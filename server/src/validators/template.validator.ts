import { z } from "zod";

export const createTemplateSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  category: z.enum(["DEVELOPMENT", "MARKETING", "OPERATIONS", "CUSTOM"]).default("CUSTOM"),
  isPublic: z.boolean().default(false),
  milestones: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      relativeDueDay: z.number().int().positive(),
      order: z.number().int().min(0),
      deliveries: z.array(
        z.object({
          title: z.string().min(1),
          type: z.enum(["FEATURE", "BUG_FIX", "DOCUMENTATION", "DESIGN", "RESEARCH", "OTHER"]),
          relativeDueDay: z.number().int().positive(),
        })
      ),
    })
  ),
});

export const updateTemplateSchema = createTemplateSchema.partial();
