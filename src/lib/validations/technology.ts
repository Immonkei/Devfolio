import { z } from "zod";

export const technologySchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  category: z.enum(["LANGUAGE", "FRAMEWORK", "DATABASE", "DEVOPS", "TOOL", "OTHER"]).default("TOOL"),
  icon: z.string().optional().nullable().or(z.literal("")),
});

export type TechnologyInput = z.infer<typeof technologySchema>;
