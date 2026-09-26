import Link from "next/link";
import { Terminal, Shield } from "lucide-react";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card/40 py-12 text-sm">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
              <Terminal className="h-4 w-4 text-primary" />
              <span>devforge // dynamic portfolio platform</span>
            </div>
            <p className="max-w-md text-xs text-muted-foreground">
              Architected with Next.js App Router, Supabase PostgreSQL, Row-Level Security,
              and full-stack content-as-data principles.
            </p>
          </div>

          {/* Quick links & Tech Specs */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>status: operational</span>
            </div>
            <Link href="/admin/login" className="hover:text-primary transition-colors flex items-center gap-1 font-mono">
              <Shield className="h-3 w-3" />
              <span>admin console</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {currentYear} DevForge. Source code licensed under MIT.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Immonkei"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span className="text-border">•</span>
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
            <span className="text-border">•</span>
            <Link href="/robots.txt" className="hover:text-foreground transition-colors">
              Robots
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
