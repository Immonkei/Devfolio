import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(160),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(350),
  content: z.string().min(20, "Content must be at least 20 characters"),
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
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  category_ids: z.array(z.string()).optional().default([]),
});

export type PostInput = z.infer<typeof postSchema>;
