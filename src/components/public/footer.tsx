import Link from "next/link";
import { Mail, Compass } from "lucide-react";
import { GithubIcon, LinkedinIcon, TelegramIcon } from "@/components/ui/icons";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/80 bg-background/80 py-8 text-xs font-mono">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Left: Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span className="font-semibold text-foreground tracking-tight">
              © {currentYear} Min Phanith
            </span>
          </div>

          {/* Right: Social Media & Contact Icon Dock */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/Immonkei"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all"
              aria-label="GitHub Profile"
              title="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>

            <a
              href="https://www.linkedin.com/in/min-phanith-5a57ba33b/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all"
              aria-label="LinkedIn Profile"
              title="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>

            <a
              href="https://t.me/minphanith"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all"
              aria-label="Telegram"
              title="Telegram"
            >
              <TelegramIcon className="h-4 w-4" />
            </a>

            <Link
              href="/contact"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all"
              aria-label="Contact"
              title="Contact / Email"
            >
              <Mail className="h-4 w-4" />
            </Link>

            <Link
              href="/sitemap.xml"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all"
              aria-label="Sitemap"
              title="Sitemap"
            >
              <Compass className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
