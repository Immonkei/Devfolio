import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug } from "@/actions/posts";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  UserCheck,
  Mail,
  ChevronRight,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { formatFullDate, readingTime } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";
import { ReadingProgress } from "@/components/public/reading-progress";
import { NoteTOC, NoteShareActions } from "@/components/public/note-toc";
import { PostWithCategories } from "@/types";
import type { Metadata } from "next";

import { getStandardPostWithCategoriesBySlug } from "@/lib/constants/posts";

async function getPostOrFallback(slug: string): Promise<PostWithCategories | null> {
  const post = await getPostBySlug(slug);
  if (post) return post;
  return getStandardPostWithCategoriesBySlug(slug);
}

function extractHeadings(content: string) {
  const lines = (content || "").split("\n");
  const headings: Array<{ id: string; text: string; level: number }> = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3).trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      headings.push({ id, text, level: 2 });
    } else if (trimmed.startsWith("### ")) {
      const text = trimmed.slice(4).trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      headings.push({ id, text, level: 3 });
    }
  }
  return headings;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostOrFallback(slug);

  if (!post) {
    return { title: "Note Not Found" };
  }

  return {
    title: `${post.title} | Engineering Notes`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at || undefined,
    },
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostOrFallback(slug);

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const wordCount = post.content ? post.content.split(/\s+/).filter(Boolean).length : 0;
  const headings = extractHeadings(post.content || "");

  return (
    <>
      <ReadingProgress />

      <article className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-10">
        {/* Navigation Breadcrumb & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Engineering Notes</span>
          </Link>

          <NoteShareActions title={post.title} />
        </div>

        {/* Note Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5 text-primary font-semibold">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Technical Field Report</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{post.published_at ? formatFullDate(post.published_at) : "Draft"}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime(post.content)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span>{wordCount.toLocaleString()} words</span>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-3">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Cover Banner */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/70 bg-secondary/20 shadow-2xl shadow-primary/5">
          <Image
            src={post.cover_image_url || "/notes/default-note.svg"}
            alt={post.title}
            fill
            preload={true}
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
        </div>

        {/* Table of Contents */}
        {headings.length > 1 && <NoteTOC headings={headings} />}

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-base pt-2">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Author Footnote Card */}
        <div className="mt-16 rounded-2xl border border-border bg-card/60 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-primary/40 bg-secondary/50">
              <Image
                src="/avatar.png"
                alt="Min Phanith"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-mono text-xs text-primary font-semibold">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Author</span>
              </div>
              <h3 className="text-base font-bold text-foreground">Min Phanith</h3>
              <p className="text-xs text-muted-foreground font-mono">
                Junior Full-Stack Developer · IT Engineering @ RUPP
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Building reliable web systems, clean REST APIs, and responsive applications. Focused on engineering discipline, automated testing, and maintainable software architecture.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60 text-xs font-mono">
            <a
              href="https://github.com/Immonkei"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
            <span className="text-border">•</span>
            <a
              href="https://www.linkedin.com/in/min-phanith-5a57ba33b/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
              <span>LinkedIn</span>
            </a>
            <span className="text-border">•</span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-primary hover:underline transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Get in touch</span>
            </Link>
          </div>
        </div>

        {/* Return to notes footer link */}
        <div className="pt-4 flex justify-between items-center text-xs font-mono text-muted-foreground">
          <Link
            href="/notes"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Field Reports</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-primary hover:underline transition-colors"
          >
            <span>Explore Engineering Projects</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </article>
    </>
  );
}
