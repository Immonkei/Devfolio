import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { ProjectWithTechnologies } from "@/types";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({ project }: { project: ProjectWithTechnologies }) {
  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-border bg-card/70 p-6 transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-lg">
      <div className="space-y-4">
        {/* Visual Cover Banner */}
        {project.cover_image_url && (
          <Link
            href={`/projects/${project.slug}`}
            className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border/60 bg-secondary/30 block group/img"
          >
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-20" />
          </Link>
        )}

        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Production Case Study
            </span>
          </div>
          {project.featured && (
            <Badge variant="default" className="text-[10px] uppercase font-mono">
              Featured
            </Badge>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            <Link href={`/projects/${project.slug}`} className="focus:outline-none">
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {project.short_description}
          </p>
        </div>

        {/* Tech Stack Pills */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.map((tech) => (
              <span
                key={tech.id}
                className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {tech.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Links */}
      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-mono">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
        >
          <span>Architecture Deep Dive</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>

        <div className="flex items-center gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Inspect Repository Source"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Launch Live Application"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
