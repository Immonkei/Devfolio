import Link from "next/link";
import { Terminal } from "lucide-react";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/80 bg-background/60 py-8 text-xs font-mono">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand & Status */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors"
            >
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span>minphanith.dev</span>
            </Link>
            <span className="text-border/60">•</span>
            <div className="inline-flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for opportunities</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-muted-foreground">
            <a
              href="https://github.com/Immonkei"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span className="text-border/60">•</span>
            <a
              href="https://www.linkedin.com/in/min-phanith-5a57ba33b/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-border/60">•</span>
            <a
              href="https://t.me/minphanith"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Telegram
            </a>
            <span className="text-border/60">•</span>
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>

        {/* Minimal Copyright */}
        <div className="mt-4 pt-4 border-t border-border/40 flex flex-col items-center justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row">
          <p>© {currentYear} Min Phanith. All rights reserved.</p>
          <p className="text-[10px] text-muted-foreground/60">
            Engineered with Next.js, TypeScript &amp; Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
