import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug } from "@/actions/projects";
import { getStandardProjectBySlug } from "@/lib/constants/projects";
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  AlertCircle,
  Lightbulb,
  Cpu,
  Scale,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { formatFullDate } from "@/lib/utils";
import { Technology } from "@/types";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let project = await getProjectBySlug(slug);
  if (!project) {
    project = getStandardProjectBySlug(slug) || null;
  }

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Engineering Case Study`,
    description: project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let project = await getProjectBySlug(slug);
  if (!project) {
    project = getStandardProjectBySlug(slug) || null;
  }

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  const sections = [
    {
      title: "Problem Statement & Context",
      icon: AlertCircle,
      content: project.problem,
    },
    {
      title: "Solution & Strategy",
      icon: Lightbulb,
      content: project.solution,
    },
    {
      title: "System Architecture",
      icon: Layers,
      content: project.architecture,
    },
    {
      title: "Technical Implementation",
      icon: Cpu,
      content: project.implementation,
    },
    {
      title: "Challenges Overcome",
      icon: AlertCircle,
      content: project.challenges,
    },
    {
      title: "Engineering Trade-offs & Decisions",
      icon: Scale,
      content: project.tradeoffs,
    },
    {
      title: "Empirical Results & Impact",
      icon: CheckCircle2,
      content: project.results,
    },
  ].filter((s) => Boolean(s.content && s.content.trim().length > 0));

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Projects Matrix</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="font-mono text-xs">
            Architecture Case Study
          </Badge>
          <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Updated {formatFullDate(project.updated_at)}</span>
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {project.title}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {project.short_description}
        </p>

        {/* Tech Stack */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.map((tech: Technology) => (
              <span
                key={tech.id}
                className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs text-foreground"
              >
                {tech.name}
              </span>
            ))}
          </div>
        )}

        {/* External links */}
        <div className="flex items-center gap-3 pt-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2 font-mono text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Source Repository</span>
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Application</span>
            </a>
          )}
        </div>
      </header>

      {/* Featured Cover Banner with Fallback */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/70 bg-secondary/20 shadow-2xl shadow-primary/5">
        <Image
          src={project.cover_image_url || "/projects/default-project.svg"}
          alt={project.title}
          fill
          preload={true}
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
      </div>

      {/* Main Narrative Sections */}
      <div className="space-y-10 border-t border-border pt-10">
        {project.description && (
          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm sm:text-base">
            <p>{project.description}</p>
          </div>
        )}

        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <section
              key={idx}
              className="rounded-xl border border-border bg-card/60 p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
                <Icon className="h-5 w-5 text-primary shrink-0" />
                <h2 className="font-mono text-base font-bold text-foreground">
                  {section.title}
                </h2>
              </div>
              <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line font-sans">
                {section.content}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
