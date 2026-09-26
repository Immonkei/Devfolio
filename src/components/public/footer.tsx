import Link from "next/link";
import { Terminal } from "lucide-react";

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
              <span>Min Phanith // Developer Portfolio</span>
            </div>
            <p className="max-w-md text-xs text-muted-foreground">
              Junior Full-Stack Developer & IT Engineering student at the Royal University of Phnom Penh (RUPP).
              Building clean REST APIs, structured database schemas, and modern web applications.
            </p>
          </div>

          {/* Status & Availability */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Junior Engineering & Internships</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {currentYear} Min Phanith. All rights reserved.</p>
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
            <a
              href="https://www.linkedin.com/in/min-phanith-5a57ba33b/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-border">•</span>
            <a
              href="https://t.me/minphanith"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Telegram
            </a>
            <span className="text-border">•</span>
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
