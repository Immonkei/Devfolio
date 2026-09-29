import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug } from "@/actions/posts";
import { ArrowLeft, Calendar, Clock, BookOpen } from "lucide-react";
import { formatFullDate } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";
import { Category, PostWithCategories } from "@/types";
import type { Metadata } from "next";

import { getStandardPostBySlug } from "@/lib/constants/posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let post: PostWithCategories | null = await getPostBySlug(slug);
  if (!post) {
    const std = getStandardPostBySlug(slug);
    if (std) {
      post = {
        id: std.id,
        title: std.title,
        slug: std.slug,
        excerpt: std.excerpt,
        content: std.content,
        cover_image_url: std.cover_image_url,
        status: std.status,
        published_at: std.published_at,
        created_at: std.published_at,
        updated_at: std.published_at,
        categories: std.category_slugs.map((s) => ({ id: `cat-${s}`, name: s.toUpperCase(), slug: s })),
      };
    }
  }

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
  let post: PostWithCategories | null = await getPostBySlug(slug);
  if (!post) {
    const std = getStandardPostBySlug(slug);
    if (std) {
      post = {
        id: std.id,
        title: std.title,
        slug: std.slug,
        excerpt: std.excerpt,
        content: std.content,
        cover_image_url: std.cover_image_url,
        status: std.status,
        published_at: std.published_at,
        created_at: std.published_at,
        updated_at: std.published_at,
        categories: std.category_slugs.map((s) => ({ id: `cat-${s}`, name: s.toUpperCase(), slug: s })),
      };
    }
  }

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const wordCount = post.content ? post.content.split(/\s+/).length : 200;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Engineering Notes</span>
        </Link>
      </div>

      {/* Note Header */}
      <header className="space-y-4 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5 text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Field Report</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{post.published_at ? formatFullDate(post.published_at) : "Draft"}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{readTimeMin} min read</span>
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {post.title}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed italic">
          {post.excerpt}
        </p>

        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.categories.map((cat: Category) => (
              <span
                key={cat.id}
                className="rounded-md border border-border bg-secondary/60 px-2.5 py-0.5 font-mono text-xs text-primary"
              >
                #{cat.slug}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Featured Cover Banner with Fallback */}
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

      {/* Article Content */}
      <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-base pt-4">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}
