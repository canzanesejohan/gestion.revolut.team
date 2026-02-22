import { z } from "zod";

export const createCheckinSchema = z.object({
  projectId: z.string().min(1),
  accomplished: z.string().min(1, "Campo requerido"),
  planned: z.string().min(1, "Campo requerido"),
  mood: z.number().int().min(1).max(5).default(3),
  blockers: z
    .array(z.object({ description: z.string().min(1) }))
    .optional()
    .default([]),
});
