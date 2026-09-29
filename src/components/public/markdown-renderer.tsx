"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Parse paragraphs and code blocks
  const sections = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-6 text-foreground/90 font-sans leading-relaxed">
      {sections.map((section, idx) => {
        if (!section.trim()) return null;

        // Code block
        if (section.startsWith("```") && section.endsWith("```")) {
          const lines = section.slice(3, -3).trim().split("\n");
          const language = lines[0].trim();
          const code = (language ? lines.slice(1) : lines).join("\n");

          return (
            <div
              key={idx}
              className="my-6 rounded-xl border border-border/80 bg-secondary/30 overflow-hidden font-mono text-xs shadow-lg"
            >
              {language && (
                <div className="flex items-center justify-between border-b border-border/60 bg-secondary/60 px-4 py-2 text-muted-foreground text-[11px]">
                  <span>{language}</span>
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-sky-200">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Parse regular markdown lines
        const lines = section.split("\n");
        const renderedElements: React.ReactNode[] = [];
        let inList = false;
        let listItems: React.ReactNode[] = [];

        const flushList = () => {
          if (inList && listItems.length > 0) {
            renderedElements.push(
              <ul key={`ul-${renderedElements.length}`} className="my-4 list-disc pl-6 space-y-1.5 text-muted-foreground">
                {listItems}
              </ul>
            );
            listItems = [];
            inList = false;
          }
        };

        lines.forEach((line, lineIdx) => {
          const trimmed = line.trim();

          // Headers
          if (trimmed.startsWith("# ")) {
            flushList();
            renderedElements.push(
              <h1 key={lineIdx} className="mt-8 mb-4 font-mono text-2xl font-bold tracking-tight text-foreground">
                {renderInlineMarkdown(trimmed.slice(2))}
              </h1>
            );
          } else if (trimmed.startsWith("## ")) {
            flushList();
            renderedElements.push(
              <h2 key={lineIdx} className="mt-6 mb-3 font-mono text-xl font-bold tracking-tight text-foreground border-b border-border/60 pb-2">
                {renderInlineMarkdown(trimmed.slice(3))}
              </h2>
            );
          } else if (trimmed.startsWith("### ")) {
            flushList();
            renderedElements.push(
              <h3 key={lineIdx} className="mt-5 mb-2 font-mono text-base font-semibold text-foreground">
                {renderInlineMarkdown(trimmed.slice(4))}
              </h3>
            );
          } else if (trimmed.startsWith("> ")) {
            // Blockquote
            flushList();
            renderedElements.push(
              <blockquote key={lineIdx} className="my-4 border-l-2 border-primary pl-4 italic text-muted-foreground bg-primary/5 py-2 rounded-r-lg">
                {renderInlineMarkdown(trimmed.slice(2))}
              </blockquote>
            );
          } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            // Unordered list item
            inList = true;
            listItems.push(
              <li key={lineIdx} className="leading-relaxed">
                {renderInlineMarkdown(trimmed.slice(2))}
              </li>
            );
          } else if (/^\d+\.\s/.test(trimmed)) {
            // Ordered list item
            flushList();
            renderedElements.push(
              <div key={lineIdx} className="flex gap-2 my-1.5 text-muted-foreground">
                <span className="font-mono text-primary font-medium">{trimmed.match(/^\d+\./)?.[0]}</span>
                <span>{renderInlineMarkdown(trimmed.replace(/^\d+\.\s*/, ""))}</span>
              </div>
            );
          } else if (trimmed.length > 0) {
            flushList();
            renderedElements.push(
              <p key={lineIdx} className="my-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
                {renderInlineMarkdown(trimmed)}
              </p>
            );
          } else {
            flushList();
          }
        });

        flushList();
        return <React.Fragment key={idx}>{renderedElements}</React.Fragment>;
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string): React.ReactNode {
  // Parse inline elements: `code`, **bold**, *italic*, [link](url)
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={match.index} className="rounded-md bg-secondary/80 px-1.5 py-0.5 font-mono text-xs text-primary border border-border/60">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const linkText = token.slice(1, token.indexOf("]("));
      const linkUrl = token.slice(token.indexOf("](") + 2, -1);
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          {linkText}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
