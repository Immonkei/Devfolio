"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Info,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Maximize2,
  X,
} from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const handleCopyCode = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.warn("Failed to copy code to clipboard:", e);
    }
  };

  // Split into major chunks: code blocks vs text blocks
  const sections = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-6 text-foreground/90 font-sans leading-relaxed selection:bg-primary/20">
      {sections.map((section, idx) => {
        if (!section.trim()) return null;

        // Fenced Code Block
        if (section.startsWith("```") && section.endsWith("```")) {
          const lines = section.slice(3, -3).trim().split("\n");
          const language = lines[0].trim() || "plaintext";
          const code = (lines[0].trim() ? lines.slice(1) : lines).join("\n");
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="my-6 rounded-xl border border-border/80 bg-secondary/30 dark:bg-card/70 overflow-hidden font-mono text-xs shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-border/60 bg-secondary/70 dark:bg-card px-4 py-2 text-muted-foreground text-[11px]">
                <span className="font-semibold text-primary uppercase tracking-wider">
                  {language}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(code, idx)}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                  title="Copy code to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sky-200 dark:text-sky-300 font-mono text-[13px] leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Parse regular markdown lines, callouts, images, and tables
        return (
          <React.Fragment key={idx}>
            {renderMarkdownBlock(section, {
              onImageClick: (src, alt) => setLightboxImage({ src, alt }),
            })}
          </React.Fragment>
        );
      })}

      {/* Lightbox Modal for Full-Resolution Image Inspection */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2.5 text-xs font-mono">
              <span className="truncate text-muted-foreground">
                {lightboxImage.alt || "Diagram Preview"}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                title="Close Lightbox"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full max-h-[75vh] overflow-auto bg-black/20 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderMarkdownBlock(
  content: string,
  handlers: { onImageClick: (src: string, alt: string) => void }
): React.ReactNode {
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      renderedElements.push(
        <ul
          key={`ul-${renderedElements.length}`}
          className="my-4 list-disc pl-6 space-y-1.5 text-muted-foreground"
        >
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      i++;
      continue;
    }

    // Markdown Table Detection: line has '|' and next line is separator '| --- |'
    if (
      trimmed.startsWith("|") &&
      trimmed.endsWith("|") &&
      i + 1 < lines.length &&
      lines[i + 1].trim().startsWith("|") &&
      lines[i + 1].includes("---")
    ) {
      flushList();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      renderedElements.push(renderTable(tableLines, renderedElements.length));
      continue;
    }

    // Horizontal Rule
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      flushList();
      renderedElements.push(
        <hr key={`hr-${i}`} className="my-8 border-t border-border/80" />
      );
      i++;
      continue;
    }

    // GitHub-Style Callout / Alert
    // Syntax: > [!NOTE] or > [!TIP] or > [!WARNING] or > [!IMPORTANT] or > [!CAUTION]
    if (trimmed.startsWith("> [!") && trimmed.includes("]")) {
      flushList();
      const alertTypeMatch = trimmed.match(/^>\s*\[!([A-Z]+)\]/i);
      const alertType = alertTypeMatch ? alertTypeMatch[1].toUpperCase() : "NOTE";
      const alertLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        alertLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      renderedElements.push(renderCallout(alertType, alertLines, renderedElements.length));
      continue;
    }

    // Standard Blockquote
    if (trimmed.startsWith("> ")) {
      flushList();
      const quoteLines: string[] = [trimmed.slice(2)];
      i++;
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      renderedElements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-5 border-l-4 border-primary pl-4 py-2 italic text-muted-foreground bg-primary/5 rounded-r-xl"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx} className="my-1">
              {renderInlineMarkdown(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Headers
    if (trimmed.startsWith("# ")) {
      flushList();
      renderedElements.push(
        <h1
          key={`h1-${i}`}
          className="mt-8 mb-4 font-mono text-2xl font-bold tracking-tight text-foreground"
        >
          {renderInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      const headingText = trimmed.slice(3);
      const headingId = headingText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      renderedElements.push(
        <h2
          key={`h2-${i}`}
          id={headingId}
          className="scroll-mt-20 mt-8 mb-4 font-mono text-xl font-bold tracking-tight text-foreground border-b border-border/60 pb-2 flex items-center justify-between group"
        >
          <span>{renderInlineMarkdown(headingText)}</span>
          <a
            href={`#${headingId}`}
            className="text-muted-foreground/40 group-hover:text-primary text-sm font-normal opacity-0 group-hover:opacity-100 transition-opacity ml-2"
            title="Anchor link"
          >
            #
          </a>
        </h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushList();
      const headingText = trimmed.slice(4);
      const headingId = headingText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      renderedElements.push(
        <h3
          key={`h3-${i}`}
          id={headingId}
          className="scroll-mt-20 mt-6 mb-3 font-mono text-base font-semibold text-foreground flex items-center group"
        >
          <span>{renderInlineMarkdown(headingText)}</span>
          <a
            href={`#${headingId}`}
            className="text-muted-foreground/40 group-hover:text-primary text-xs font-normal opacity-0 group-hover:opacity-100 transition-opacity ml-2"
            title="Anchor link"
          >
            #
          </a>
        </h3>
      );
      i++;
      continue;
    }

    // Standalone Markdown Image / Image Gallery
    // Syntax: ![alt text](url)
    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      flushList();
      const images: Array<{ alt: string; url: string }> = [
        { alt: imageMatch[1], url: imageMatch[2] },
      ];

      // Check if subsequent lines are also standalone images to form an image gallery grid
      while (i + 1 < lines.length && lines[i + 1].trim().match(/^!\[(.*?)\]\((.*?)\)$/)) {
        i++;
        const nextMatch = lines[i].trim().match(/^!\[(.*?)\]\((.*?)\)$/);
        if (nextMatch) {
          images.push({ alt: nextMatch[1], url: nextMatch[2] });
        }
      }

      renderedElements.push(
        renderImageGallery(images, renderedElements.length, handlers.onImageClick)
      );
      i++;
      continue;
    }

    // Task Checklist: - [ ] or - [x]
    const taskMatch = trimmed.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
    if (taskMatch) {
      flushList();
      const isChecked = taskMatch[1].toLowerCase() === "x";
      const itemText = taskMatch[2];
      renderedElements.push(
        <div key={`task-${i}`} className="flex items-start gap-2.5 my-2 text-muted-foreground">
          <input
            type="checkbox"
            checked={isChecked}
            readOnly
            className="mt-1 h-4 w-4 rounded border-border text-primary cursor-default"
          />
          <span className={isChecked ? "line-through text-muted-foreground/60" : ""}>
            {renderInlineMarkdown(itemText)}
          </span>
        </div>
      );
      i++;
      continue;
    }

    // Unordered List Item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true;
      listItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {renderInlineMarkdown(trimmed.slice(2))}
        </li>
      );
      i++;
      continue;
    }

    // Ordered List Item
    if (/^\d+\.\s/.test(trimmed)) {
      flushList();
      renderedElements.push(
        <div key={`ol-${i}`} className="flex gap-2 my-1.5 text-muted-foreground">
          <span className="font-mono text-primary font-medium">{trimmed.match(/^\d+\./)?.[0]}</span>
          <span>{renderInlineMarkdown(trimmed.replace(/^\d+\.\s*/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Standard Paragraph
    flushList();
    renderedElements.push(
      <p key={`p-${i}`} className="my-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
    i++;
  }

  flushList();
  return <>{renderedElements}</>;
}

function renderImageGallery(
  images: Array<{ alt: string; url: string }>,
  key: number,
  onImageClick: (src: string, alt: string) => void
) {
  if (images.length === 1) {
    const img = images[0];
    return (
      <figure
        key={`img-${key}`}
        className="group relative my-6 overflow-hidden rounded-xl border border-border/80 bg-card/60 shadow-lg"
      >
        <div
          className="relative aspect-[16/9] w-full overflow-hidden bg-secondary/20 cursor-zoom-in"
          onClick={() => onImageClick(img.url, img.alt)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.alt || "Article diagram"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center gap-1">
            <Maximize2 className="h-3 w-3" />
            <span>Enlarge</span>
          </div>
        </div>
        {img.alt && (
          <figcaption className="border-t border-border/60 bg-secondary/30 px-4 py-2 font-mono text-xs text-muted-foreground text-center">
            {img.alt}
          </figcaption>
        )}
      </figure>
    );
  }

  // Multi-Image Gallery Grid (2 or 3 columns)
  const gridCols =
    images.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div key={`gallery-${key}`} className="my-6 space-y-2">
      <div className={`grid gap-3 ${gridCols}`}>
        {images.map((img, imgIdx) => (
          <figure
            key={imgIdx}
            className="group relative overflow-hidden rounded-lg border border-border/80 bg-card/60 shadow-sm"
          >
            <div
              className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/20 cursor-zoom-in"
              onClick={() => onImageClick(img.url, img.alt)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || `Figure ${imgIdx + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 rounded bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="h-3 w-3" />
              </div>
            </div>
            {img.alt && (
              <figcaption className="border-t border-border/60 bg-secondary/20 px-3 py-1.5 font-mono text-[11px] text-muted-foreground truncate">
                {img.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      <div className="text-right font-mono text-[10px] text-muted-foreground/70">
        Gallery ({images.length} images) · Click to enlarge
      </div>
    </div>
  );
}

function renderCallout(type: string, lines: string[], key: number) {
  interface CalloutMeta {
    icon: React.ReactNode;
    title: string;
    border: string;
    bg: string;
    text: string;
  }

  const map: Record<string, CalloutMeta> = {
    NOTE: {
      icon: <Info className="h-4 w-4 text-sky-400 shrink-0" />,
      title: "Note",
      border: "border-sky-500/40",
      bg: "bg-sky-500/10",
      text: "text-sky-300",
    },
    TIP: {
      icon: <Lightbulb className="h-4 w-4 text-emerald-400 shrink-0" />,
      title: "Tip & Optimization",
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
    },
    IMPORTANT: {
      icon: <AlertCircle className="h-4 w-4 text-purple-400 shrink-0" />,
      title: "Important Architectural Rule",
      border: "border-purple-500/40",
      bg: "bg-purple-500/10",
      text: "text-purple-300",
    },
    WARNING: {
      icon: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
      title: "Caution / Warning",
      border: "border-amber-500/40",
      bg: "bg-amber-500/10",
      text: "text-amber-300",
    },
    CAUTION: {
      icon: <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />,
      title: "Critical Vulnerability",
      border: "border-rose-500/40",
      bg: "bg-rose-500/10",
      text: "text-rose-300",
    },
  };

  const meta = map[type] || map.NOTE;

  return (
    <div
      key={`callout-${key}`}
      className={`my-5 rounded-xl border ${meta.border} ${meta.bg} p-4 space-y-2`}
    >
      <div className="flex items-center gap-2 font-mono text-xs font-semibold">
        {meta.icon}
        <span className={meta.text}>{meta.title}</span>
      </div>
      <div className="text-xs sm:text-sm text-foreground/85 leading-relaxed pl-6 space-y-1">
        {lines.map((l, lIdx) => (
          <p key={lIdx}>{renderInlineMarkdown(l)}</p>
        ))}
      </div>
    </div>
  );
}

function renderTable(tableLines: string[], key: number) {
  if (tableLines.length < 2) return null;

  const parseRow = (rowStr: string) =>
    rowStr
      .split("|")
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1);

  const headerCells = parseRow(tableLines[0]);
  const bodyRows = tableLines.slice(2).map(parseRow);

  return (
    <div
      key={`table-${key}`}
      className="my-6 overflow-x-auto rounded-xl border border-border bg-card/60 shadow-sm"
    >
      <table className="w-full border-collapse font-mono text-xs">
        <thead>
          <tr className="border-b border-border bg-secondary/50 text-left text-foreground font-semibold">
            {headerCells.map((h, hIdx) => (
              <th key={hIdx} className="p-3">
                {renderInlineMarkdown(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-secondary/30 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-3 text-muted-foreground">
                  {renderInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Tokenize inline images, links, codes, bold, and italics
  const regex =
    /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    // Inline image
    if (token.startsWith("![") && token.includes("](") && token.endsWith(")")) {
      const alt = token.slice(2, token.indexOf("]("));
      const url = token.slice(token.indexOf("](") + 2, -1);
      parts.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={match.index}
          src={url}
          alt={alt}
          className="inline-block max-h-6 rounded border border-border align-middle mx-1"
        />
      );
    }
    // Inline link
    else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const linkText = token.slice(1, token.indexOf("]("));
      const linkUrl = token.slice(token.indexOf("](") + 2, -1);
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors font-medium"
        >
          {linkText}
        </a>
      );
    }
    // Inline code
    else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="rounded-md bg-secondary/80 px-1.5 py-0.5 font-mono text-xs text-primary border border-border/60"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    // Bold
    else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    }
    // Italic
    else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
