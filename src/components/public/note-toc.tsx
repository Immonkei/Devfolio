"use client";

import { useState } from "react";
import { ListTree, ChevronDown, ChevronUp, Share2, Check, ArrowUp } from "lucide-react";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function NoteTOC({ headings }: { headings: HeadingItem[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl border border-border/80 bg-secondary/30 p-4 font-mono text-xs shadow-xs"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors cursor-pointer select-none"
        >
          <ListTree className="h-4 w-4 text-primary" />
          <span>In This Architectural Report ({headings.length})</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
      </div>

      {isOpen && (
        <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3 text-muted-foreground">
          {headings.map((h, idx) => (
            <li
              key={idx}
              className={`${h.level === 3 ? "pl-4 text-[11px]" : "font-medium text-xs"} hover:text-primary transition-colors`}
            >
              <a href={`#${h.id}`} className="hover:underline flex items-center gap-1.5">
                <span className="text-primary/60 text-[10px]">
                  {h.level === 2 ? `0${idx + 1}.` : "•"}
                </span>
                <span>{h.text}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export function NoteShareActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore failure
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
        title={`Copy link to "${title}"`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-3.5 w-3.5 text-primary" />
            <span>Share Note</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleScrollTop}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
        title="Scroll to top"
      >
        <ArrowUp className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Top</span>
      </button>
    </div>
  );
}
