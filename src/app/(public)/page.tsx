import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/server";
import { fetchGitHubRepositories } from "@/lib/github/client";
import { ProjectCard } from "@/components/public/project-card";
import { ExperienceCard } from "@/components/public/experience-card";
import { NoteCard } from "@/components/public/note-card";
import { GitHubFeed } from "@/components/public/github-feed";
import { TechBadge } from "@/components/public/tech-badge";
import { Button } from "@/components/ui/button";
import {
  FolderGit2,
  Briefcase,
  Cpu,
  FileText,
  Mail,
  ArrowRight,
  Download,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import {
  ProjectWithTechnologies,
  PostWithCategories,
  Experience,
  Technology,
  Profile,
  Category,
  GitHubRepo,
} from "@/types";

export const revalidate = 60; // Incremental static regeneration every 60s

export default async function HomePage() {
  let profile: Profile | null = null;
  let projects: ProjectWithTechnologies[] = [];
  let experiences: Experience[] = [];
  let technologies: Technology[] = [];
  let posts: PostWithCategories[] = [];
  let repos: GitHubRepo[] = [];

  try {
    const supabase = createPublicClient();

    const [
      { data: profileData },
      { data: projectsData },
      { data: experiencesData },
      { data: technologiesData },
      { data: postsData },
    ] = await Promise.all([
      supabase.from("profiles").select("*").limit(1).single(),
      supabase
        .from("projects")
        .select("*, project_technologies(technology_id, technologies(*))")
        .eq("status", "PUBLISHED")
        .order("display_order", { ascending: true })
        .limit(4),
      supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true })
        .limit(3),
      supabase
        .from("technologies")
        .select("*")
        .order("name", { ascending: true }),
      supabase
        .from("posts")
        .select("*, post_categories(category_id, categories(*))")
        .eq("status", "PUBLISHED")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    if (profileData) profile = profileData;
    if (projectsData) {
      projects = projectsData.map((p) => ({
        ...p,
        technologies: (p.project_technologies || []).map((pt: { technologies: Technology | null }) => pt.technologies).filter(Boolean) as Technology[],
      }));
    }
    if (experiencesData) experiences = experiencesData;
    if (technologiesData) technologies = technologiesData;
    if (postsData) {
      posts = postsData.map((p) => ({
        ...p,
        categories: (p.post_categories || []).map((pc: { categories: Category | null }) => pc.categories).filter(Boolean) as Category[],
      }));
    }

    const githubUser = process.env.GITHUB_USERNAME || "Immonkei";
    repos = await fetchGitHubRepositories(githubUser);
  } catch (err) {
    console.error("Home page query error:", err);
  }

  // Fallback defaults if database tables are being newly seeded
  const engineerName = profile?.name || "Senior Systems Engineer";
  const engineerHeadline =
    profile?.headline || "Staff Systems & Full-Stack Platform Engineer";
  const engineerBio =
    profile?.bio ||
    "Specializing in high-throughput distributed systems, modern Next.js/Supabase architectures, and resilient cloud infrastructure. Portfolio content is 100% data-driven.";

  return (
    <div className="space-y-24 py-12 md:py-16">
      {/* 1. HERO SECTION */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-8 sm:p-12 md:p-16 tech-grid-bg">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>PRODUCTION PLATFORM // ARCHITECTURE ACTIVE</span>
            </div>

            <h1 className="font-mono text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {engineerName}
            </h1>

            <p className="font-mono text-lg text-primary sm:text-xl font-medium">
              {engineerHeadline}
            </p>

            <p className="text-base text-muted-foreground leading-relaxed sm:text-lg">
              {engineerBio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/projects">
                <Button className="gap-2 font-mono text-xs">
                  <FolderGit2 className="h-4 w-4" />
                  <span>Inspect Projects</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" className="gap-2 font-mono text-xs">
                  <Mail className="h-4 w-4" />
                  <span>Direct Inquiry</span>
                </Button>
              </Link>
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Curriculum Vitae</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SELECTED PROJECTS */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>Architectural Case Studies</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Featured Engineering Work
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
          >
            <span>View all projects</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-xs font-mono text-muted-foreground">
            No published projects found. Log into the admin console to publish projects.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* 3. ENGINEERING EXPERIENCE */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Career Track Record</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Work Experience
            </h2>
          </div>
          <Link
            href="/experience"
            className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
          >
            <span>Full career history</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {experiences.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-xs font-mono text-muted-foreground">
            No career milestones recorded yet. Add experience entries in the control plane.
          </div>
        ) : (
          <div className="space-y-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </section>

      {/* 4. TECHNOLOGIES */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border bg-card/50 p-8 sm:p-10">
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-2">
            <Cpu className="h-3.5 w-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
            Production Tech Stack & Tooling
          </h2>

          {technologies.length === 0 ? (
            <div className="text-xs font-mono text-muted-foreground">
              Technologies will populate automatically from Supabase.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {technologies.map((tech) => (
                <TechBadge key={tech.id} tech={tech} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. ENGINEERING NOTES */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5" />
              <span>Systems & Architecture Articles</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Engineering Notes
            </h2>
          </div>
          <Link
            href="/notes"
            className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
          >
            <span>All technical notes</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-xs font-mono text-muted-foreground">
            No published notes found. Publish technical writeups in the control plane.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <NoteCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* 6. GITHUB REPOSITORIES */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
              <GithubIcon className="h-3.5 w-3.5" />
              <span>Real-Time Code Activity</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Open Source Repositories
            </h2>
          </div>
        </div>

        <GitHubFeed repos={repos} />
      </section>

      {/* 7. CONTACT CTA */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center flex flex-col items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Initiate Consultation
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
            Interested in Collaboration or Engineering Leadership?
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Available for principal architecture advisory, technical leadership roles, and high-impact distributed systems engineering.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link href="/contact">
              <Button className="gap-2 font-mono text-xs">
                <Mail className="h-3.5 w-3.5" />
                <span>Contact Engineering Desk</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
