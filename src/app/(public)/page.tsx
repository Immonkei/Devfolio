import Link from "next/link";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/server";
import { fetchGitHubRepositories, fetchGitHubActivity } from "@/lib/github/client";
import { ProjectCard } from "@/components/public/project-card";
import { ExperienceCard } from "@/components/public/experience-card";
import { NoteCard } from "@/components/public/note-card";
import { GitHubFeed } from "@/components/public/github-feed";
import { GitHubActivityGraph } from "@/components/public/github-activity-graph";
import { TechBadge } from "@/components/public/tech-badge";
import { STANDARD_TECHNOLOGIES } from "@/lib/tech-icons";
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
  GitHubActivityData,
} from "@/types";

export const revalidate = 60; // Incremental static regeneration every 60s

export default async function HomePage() {
  let profile: Profile | null = null;
  let projects: ProjectWithTechnologies[] = [];
  let experiences: Experience[] = [];
  let technologies: Technology[] = [];
  let posts: PostWithCategories[] = [];
  let repos: GitHubRepo[] = [];
  let activity: GitHubActivityData | null = null;
  const githubUser = process.env.GITHUB_USERNAME || "Immonkei";

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

    const [fetchedRepos, fetchedActivity] = await Promise.all([
      fetchGitHubRepositories(githubUser),
      fetchGitHubActivity(githubUser),
    ]);
    repos = fetchedRepos;
    activity = fetchedActivity;
  } catch (err) {
    console.error("Home page query error:", err);
  }

  // Fallback defaults if database tables are being newly seeded
  const engineerName = profile?.name || "Min Phanith";
  const engineerHeadline =
    profile?.headline || "Junior Full-Stack Developer · IT Engineering @ RUPP";
  const engineerBio =
    profile?.bio ||
    "I build responsive, accessible web applications and reliable backend services. Bridging engineering fundamentals with modern React, TypeScript, Node.js, and database systems.";
  const resumeUrl = profile?.resume_url || "/resume.pdf";

  const fallbackTechnologies: Technology[] = STANDARD_TECHNOLOGIES.map((t, idx) => ({
    id: `std-tech-${idx + 1}`,
    name: t.name,
    category: t.category,
    icon: t.icon,
    created_at: "",
  }));

  const activeTechnologies = technologies.length > 0 ? technologies : fallbackTechnologies;

  const categoryMeta: Record<string, string> = {
    LANGUAGE: "Programming Languages",
    FRAMEWORK: "Frameworks & Libraries",
    DATABASE: "Databases & Storage",
    DEVOPS: "DevOps & Cloud Infrastructure",
    TOOL: "Developer Tools & Environment",
    OTHER: "Other Technologies",
  };

  const categoryOrder = ["LANGUAGE", "FRAMEWORK", "DATABASE", "DEVOPS", "TOOL", "OTHER"];
  const groupedTechnologies = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryMeta[cat] || cat,
      items: activeTechnologies.filter((t) => t.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  const customCategoryItems = activeTechnologies.filter(
    (t) => !categoryOrder.includes(t.category)
  );
  if (customCategoryItems.length > 0) {
    groupedTechnologies.push({
      category: "OTHER_CUSTOM",
      label: "Specialized Stack",
      items: customCategoryItems,
    });
  }

  return (
    <div className="space-y-24 py-12 md:py-16">
      {/* 1. HERO SECTION */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-8 sm:p-12 md:p-16 tech-grid-bg">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-14">
            <div className="flex-1 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>FULL-STACK DEVELOPER // IT ENGINEERING @ RUPP</span>
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
                    <span>Explore Projects</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" className="gap-2 font-mono text-xs">
                    <Mail className="h-4 w-4" />
                    <span>Get In Touch</span>
                  </Button>
                </Link>
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download CV</span>
                  </a>
                )}
              </div>
            </div>

            {/* Clean, Prestigious Portrait Container */}
            <div className="relative shrink-0 flex items-center justify-center my-4 lg:my-0">
              {/* Soft, Diffused Ambient Backlight Aura */}
              <div className="absolute -inset-4 sm:-inset-8 rounded-full bg-gradient-to-tr from-primary/25 via-cyan-400/15 to-blue-600/20 blur-3xl opacity-70 pointer-events-none" />

              {/* Minimalist Floating Status Pill */}
              <div className="absolute top-2 -right-1 sm:top-4 sm:-right-2 z-20">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur-md shadow-sm transition-colors hover:border-primary/40 hover:text-foreground">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="font-medium text-foreground">Available for hire</span>
                </div>
              </div>

              {/* Portrait with Natural, Smooth Bottom Dissolve (No Box Clipping) */}
              <div className="relative z-10 [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]">
                <Image
                  src={profile?.avatar_url || "/avatar.png"}
                  alt={engineerName}
                  width={400}
                  height={400}
                  preload={true}
                  className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-[0_15px_35px_rgba(56,189,248,0.22)] transition-transform duration-500 ease-out hover:scale-[1.02]"
                />
              </div>
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
            No published projects yet. Check back soon!
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
            No experience records available yet.
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
        <div className="rounded-2xl border border-border bg-card/50 p-8 sm:p-10 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-2">
              <Cpu className="h-3.5 w-3.5" />
              <span>Technical Capabilities</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Production Tech Stack & Tooling
            </h2>
            <p className="mt-1 text-xs text-muted-foreground font-mono">
              Categorized by technical layer: programming languages, modern frameworks, databases, and cloud tooling.
            </p>
          </div>

          {groupedTechnologies.length === 0 ? (
            <div className="text-xs font-mono text-muted-foreground">
              Technologies coming soon.
            </div>
          ) : (
            <div className="space-y-6">
              {groupedTechnologies.map((group) => (
                <div
                  key={group.category}
                  className="rounded-xl border border-border/70 bg-card/60 p-5 space-y-3.5"
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                    <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                      {`// ${group.label}`}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {group.items.length} {group.items.length === 1 ? "technology" : "technologies"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {group.items.map((tech) => (
                      <TechBadge key={tech.id} tech={tech} />
                    ))}
                  </div>
                </div>
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
            No published notes yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <NoteCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* 6. GITHUB REPOSITORIES & REAL-TIME ACTIVITY */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
            <GithubIcon className="h-3.5 w-3.5" />
            <span>Real-Time Code Activity</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Open Source &amp; Commit Telemetry
          </h2>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            Live engineering activity stream and production repositories synced directly from GitHub.
          </p>
        </div>

        {/* Live Contribution Heatmap */}
        <GitHubActivityGraph activity={activity} username={githubUser} />

        {/* Featured Repositories Grid */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-primary uppercase tracking-wider">
              {`// Featured Repositories`}
            </span>
            <a
              href={`https://github.com/${githubUser}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
            >
              <span>Explore all repositories</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
          <GitHubFeed repos={repos} />
        </div>
      </section>

      {/* 7. CONTACT CTA */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center flex flex-col items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Open to Opportunities
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
            Let&apos;s Build Something Together
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Available for junior engineering positions, internships, freelance projects, and open-source collaborations.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link href="/contact">
              <Button className="gap-2 font-mono text-xs">
                <Mail className="h-3.5 w-3.5" />
                <span>Get In Touch</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
