"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Terminal, Menu, X, FileText } from "lucide-react";
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
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
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
                  "rounded-md px-3 py-1.5 transition-colors",
                  isActive
                    ? "bg-secondary text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / GitHub / Resume */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/Immonkei"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Resume (PDF)</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="https://github.com/Immonkei"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground"
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
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-primary font-semibold"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <span>{item.name}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-border/80 bg-secondary/40 px-3 py-2 text-sm font-medium text-primary mt-2"
            >
              <FileText className="h-4 w-4" />
              <span>Download Resume (PDF)</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
