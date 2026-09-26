import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/public/project-card";
import { FolderGit2 } from "lucide-react";
import { ProjectWithTechnologies, Technology } from "@/types";

export const metadata = {
  title: "Engineering Projects",
  description: "Production projects, distributed systems architectures, and software engineering case studies.",
};

export const revalidate = 60;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; tech?: string }>;
}) {
  const { query, tech } = await searchParams;
  let projects: ProjectWithTechnologies[] = [];

  try {
    const supabase = await createClient();
    const queryBuilder = supabase
      .from("projects")
      .select("*, project_technologies(technology_id, technologies(*))")
      .eq("status", "PUBLISHED")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    const { data } = await queryBuilder;

    if (data) {
      projects = data.map((p) => ({
        ...p,
        technologies: (p.project_technologies || []).map((pt: { technologies: Technology | null }) => pt.technologies).filter(Boolean) as Technology[],
      }));

      // Filter by query if present
      if (query) {
        const q = query.toLowerCase();
        projects = projects.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.short_description.toLowerCase().includes(q) ||
            p.technologies.some((t) => t.name.toLowerCase().includes(q))
        );
      }

      // Filter by tech if present
      if (tech) {
        const t = tech.toLowerCase();
        projects = projects.filter((p) =>
          p.technologies.some((it) => it.name.toLowerCase() === t)
        );
      }
    }
  } catch (err) {
    console.error("Projects query error:", err);
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider">
          <FolderGit2 className="h-4 w-4" />
          <span>Case Studies & Implementations</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Engineered Systems & Projects
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
          Detailed technical writeups of production systems, architecture trade-offs, scalability bottlenecks solved, and concrete results.
        </p>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            No published projects match the query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
