import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  startDate: z.string().transform((s) => new Date(s)),
  endDate: z.string().transform((s) => new Date(s)),
  managerId: z.string().min(1),
});

export const updateProjectSchema = createProjectSchema.partial();
