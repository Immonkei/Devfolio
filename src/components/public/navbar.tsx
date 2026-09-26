"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Terminal, Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Overview", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Experience", href: "/experience" },
  { name: "Engineering Notes", href: "/notes" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary group-hover:border-primary/50">
            <Terminal className="h-4 w-4 text-primary" />
          </div>
          <span className="flex items-center gap-1">
            <span>minphanith</span>
            <span className="text-primary font-bold">.dev</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 font-mono text-xs">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center rounded-lg px-3 py-1.5 transition-all duration-200 border",
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary font-semibold shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                    : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action / GitHub */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="https://github.com/Immonkei"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/30 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_10px_rgba(56,189,248,0.15)]"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="https://github.com/Immonkei"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card/95 px-4 py-4 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3.5 py-2 font-mono text-xs transition-all duration-200 border",
                    isActive
                      ? "border-primary/40 bg-primary/10 text-primary font-semibold shadow-[0_0_10px_rgba(56,189,248,0.12)]"
                      : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
