import { createClient } from "@/lib/supabase/server";
import {
  FolderGit2,
  FileText,
  Briefcase,
  Mail,
  Eye,
  ArrowUpRight,
  Plus,
  Activity,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  let stats = {
    totalProjects: 0,
    publishedPosts: 0,
    totalExperiences: 0,
    unreadMessages: 0,
    pageViews: 0,
  };

  let recentMessages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    created_at: string;
  }> = [];

  let recentProjects: Array<{
    id: string;
    title: string;
    status: string;
    slug: string;
    created_at: string;
  }> = [];

  try {
    const supabase = await createClient();

    const [
      { count: projectsCount },
      { count: postsCount },
      { count: experiencesCount },
      { count: messagesCount },
      { count: viewsCount },
      { data: messagesData },
      { data: projectsData },
    ] = await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "PUBLISHED"),
      supabase.from("experiences").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "NEW"),
      supabase.from("page_views").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("id, name, email, subject, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("projects").select("id, title, status, slug, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    stats = {
      totalProjects: projectsCount || 0,
      publishedPosts: postsCount || 0,
      totalExperiences: experiencesCount || 0,
      unreadMessages: messagesCount || 0,
      pageViews: viewsCount || 0,
    };

    if (messagesData) recentMessages = messagesData;
    if (projectsData) recentProjects = projectsData;
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
  }

  const statCards = [
    {
      title: "Projects",
      value: stats.totalProjects,
      description: "Case studies & repos",
      icon: FolderGit2,
      href: "/admin/projects",
      color: "text-sky-400",
    },
    {
      title: "Published Notes",
      value: stats.publishedPosts,
      description: "Technical articles",
      icon: FileText,
      href: "/admin/posts",
      color: "text-emerald-400",
    },
    {
      title: "Experience Entries",
      value: stats.totalExperiences,
      description: "Career timeline",
      icon: Briefcase,
      href: "/admin/experience",
      color: "text-indigo-400",
    },
    {
      title: "Inbound Messages",
      value: stats.unreadMessages,
      description: "Unread inquiries",
      icon: Mail,
      href: "/admin/messages",
      color: "text-amber-400",
    },
    {
      title: "Total Impressions",
      value: stats.pageViews,
      description: "Audited visits",
      icon: Eye,
      href: "/admin/dashboard",
      color: "text-violet-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
            <Activity className="h-3.5 w-3.5" />
            <span>Control Plane Overview</span>
          </div>
          <h1 className="mt-1 font-mono text-2xl font-bold tracking-tight text-foreground">
            System Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/projects">
            <Button size="sm" className="gap-1.5 font-mono text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>New Project</span>
            </Button>
          </Link>
          <Link href="/admin/posts">
            <Button size="sm" variant="secondary" className="gap-1.5 font-mono text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>New Note</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:bg-card/80"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{card.title}</span>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <div className="mt-3 font-mono text-3xl font-bold text-foreground">
                {card.value}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{card.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Summary Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h2 className="font-mono text-sm font-semibold text-foreground">Recent Projects</h2>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {recentProjects.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground font-mono">
                No projects indexed in the database yet.
              </div>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-sm text-foreground">{project.title}</div>
                    <div className="font-mono text-xs text-muted-foreground">/{project.slug}</div>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-medium ${
                      project.status === "PUBLISHED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <h2 className="font-mono text-sm font-semibold text-foreground">Inbound Inquiries</h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>View inbox</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {recentMessages.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground font-mono">
                No contact inquiries received.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-center justify-between py-3">
                  <div className="max-w-[80%]">
                    <div className="font-medium text-sm text-foreground truncate">{msg.subject}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {msg.name} &lt;{msg.email}&gt;
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
