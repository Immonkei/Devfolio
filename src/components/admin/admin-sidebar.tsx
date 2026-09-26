"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Cpu,
  FileText,
  Mail,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Technologies", href: "/admin/technologies", icon: Cpu },
  { name: "Engineering Notes", href: "/admin/posts", icon: FileText },
  { name: "Contact Messages", href: "/admin/messages", icon: Mail },
  { name: "Media Assets", href: "/admin/media", icon: ImageIcon },
  { name: "Settings & Profile", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/60 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Header Branding */}
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Terminal className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold tracking-tight text-foreground">
              devforge<span className="text-primary">:root</span>
            </span>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Control Plane
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {ADMIN_NAV.map((item) => {
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to public site */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}
