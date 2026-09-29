"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X, ExternalLink, Terminal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_NAV } from "./admin-sidebar";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
            aria-label="Toggle admin navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SESSION_ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 font-mono text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
            title="Sign out of Admin Session"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-xl md:hidden overflow-y-auto p-4 space-y-4 border-b border-border animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5 px-3 py-2 border-b border-border pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <span className="font-mono text-xs font-bold text-foreground">
              Admin Navigation
            </span>
          </div>

          <nav className="space-y-1">
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
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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

          <div className="pt-2 border-t border-border">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
