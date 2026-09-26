import { z } from "zod";

export const educationSchema = z.object({
  institution: z.string().min(2, "Institution is required").max(120),
  degree: z.string().min(2, "Degree is required").max(120),
  description: z.string().optional().nullable().or(z.literal("")),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be YYYY-MM-DD").optional().nullable().or(z.literal("")),
  display_order: z.number().int().default(0),
});

export type EducationInput = z.infer<typeof educationSchema>;
