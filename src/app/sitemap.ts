import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/experience`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const supabase = await createClient();
    const [{ data: projects }, { data: posts }] = await Promise.all([
      supabase.from("projects").select("slug, updated_at").eq("status", "PUBLISHED"),
      supabase.from("posts").select("slug, updated_at").eq("status", "PUBLISHED"),
    ]);

    const projectUrls: MetadataRoute.Sitemap = (projects || []).map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const postUrls: MetadataRoute.Sitemap = (posts || []).map((p) => ({
      url: `${siteUrl}/notes/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...projectUrls, ...postUrls];
  } catch {
    return staticRoutes;
  }
}
