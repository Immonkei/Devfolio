import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getProjects } from "@/actions/projects";
import { getStandardProjectBySlug, STANDARD_PROJECTS } from "@/lib/constants/projects";
import {
  ArrowLeft,
  ArrowRight,
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
import { MarkdownRenderer } from "@/components/public/markdown-renderer";
import { ProjectImageGallery } from "@/components/public/project-image-gallery";
import { extractProjectImages, cleanNarrativeContent } from "@/lib/project-images";
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

  const images = extractProjectImages(project);
  const primaryImageUrl = images[0]?.url;

  return {
    title: `${project.title} | Engineering Case Study`,
    description: project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      type: "article",
      images: primaryImageUrl ? [{ url: primaryImageUrl }] : [],
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

  // Fetch adjacent projects for bottom navigation
  let allProjects = await getProjects();
  if (!allProjects || allProjects.length === 0) {
    allProjects = STANDARD_PROJECTS;
  }
  const publishedProjects = allProjects.filter((p) => p.status === "PUBLISHED");
  const currentIndex = publishedProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? publishedProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < publishedProjects.length - 1
      ? publishedProjects[currentIndex + 1]
      : null;

  // Extract all uploaded and linked visual assets
  const projectImages = extractProjectImages(project);
  const cleanDescription = cleanNarrativeContent(project.description || "");

  const sections = [
    {
      title: "The Problem",
      icon: AlertCircle,
      content: project.problem,
    },
    {
      title: "The Solution",
      icon: Lightbulb,
      content: project.solution,
    },
    {
      title: "Architecture",
      icon: Layers,
      content: project.architecture,
    },
    {
      title: "Implementation",
      icon: Cpu,
      content: project.implementation,
    },
    {
      title: "Key Challenges",
      icon: AlertCircle,
      content: project.challenges,
    },
    {
      title: "Trade-offs",
      icon: Scale,
      content: project.tradeoffs,
    },
    {
      title: "Results & Impact",
      icon: CheckCircle2,
      content: project.results,
    },
  ].filter((s) => Boolean(s.content && s.content.trim().length > 0));

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-12">
      {/* Return to Projects navigation */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Projects</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="font-mono text-xs">
            Case Study
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

      {/* Interactive Project Showcase Gallery (Displays all pictures uploaded for this project) */}
      <ProjectImageGallery
        images={projectImages}
        projectTitle={project.title}
      />

      {/* Main Narrative & Deep-Dive Sections */}
      <div className="space-y-10 border-t border-border pt-10">
        {cleanDescription && (
          <div className="space-y-4">
            <MarkdownRenderer content={cleanDescription} />
          </div>
        )}

        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <section
              key={idx}
              className="rounded-xl border border-border bg-card/60 p-6 sm:p-8 space-y-4 shadow-xs"
            >
              <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
                <Icon className="h-5 w-5 text-primary shrink-0" />
                <h2 className="font-mono text-base font-bold text-foreground">
                  {section.title}
                </h2>
              </div>
              <MarkdownRenderer content={section.content || ""} />
            </section>
          );
        })}
      </div>

      {/* Bottom Adjacent Projects Navigation */}
      {(prevProject || nextProject) && (
        <div className="border-t border-border pt-10 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Explore More Engineering Work</span>
            <Link href="/projects" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card/50 p-4 hover:border-primary/50 hover:bg-card transition-all"
              >
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>Previous Project</span>
                </div>
                <div className="mt-2 font-mono font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {prevProject.title}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex flex-col justify-between items-end text-right rounded-xl border border-border bg-card/50 p-4 hover:border-primary/50 hover:bg-card transition-all"
              >
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Next Project</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
                <div className="mt-2 font-mono font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {nextProject.title}
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
