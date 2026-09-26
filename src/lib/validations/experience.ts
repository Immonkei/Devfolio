import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string().min(2, "Company name is required").max(100),
  role: z.string().min(2, "Role is required").max(100),
  description: z.string().min(10, "Description is required"),
  responsibilities: z.array(z.string().min(1)).default([]),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be YYYY-MM-DD").optional().nullable().or(z.literal("")),
  is_current: z.boolean().default(false),
  display_order: z.number().int().default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
