import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  short_description: z.string().min(10, "Short description must be at least 10 characters").max(300),
  description: z.string().min(20, "Description must be at least 20 characters"),
  problem: z.string().optional().default(""),
  solution: z.string().optional().default(""),
  architecture: z.string().optional().default(""),
  implementation: z.string().optional().default(""),
  challenges: z.string().optional().default(""),
  tradeoffs: z.string().optional().default(""),
  results: z.string().optional().default(""),
  cover_image_url: z
    .string()
    .trim()
    .refine(
      (val) =>
        val === "" ||
        val.startsWith("/") ||
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("data:image/"),
      { message: "Must be a valid URL, path starting with /, or image data URL" }
    )
    .optional()
    .nullable()
    .or(z.literal("")),
  github_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  live_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  display_order: z.number().int().default(0),
  technology_ids: z.array(z.string()).optional().default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
