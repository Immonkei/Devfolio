import Link from "next/link";
import Image from "next/image";
import { formatFullDate } from "@/lib/utils";
import { PostWithCategories } from "@/types";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export function NoteCard({ post }: { post: PostWithCategories }) {
  // Approximate reading time
  const wordCount = post.content ? post.content.split(/\s+/).length : 200;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-border bg-card/60 p-6 transition-all hover:border-primary/50 hover:bg-card">
      <div className="space-y-4">
        {/* Visual Cover Banner */}
        {post.cover_image_url && (
          <Link
            href={`/notes/${post.slug}`}
            className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border/60 bg-secondary/30 block group/img"
          >
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-20" />
          </Link>
        )}

        {/* Metadata Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>{post.published_at ? formatFullDate(post.published_at) : "Draft Note"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{readTimeMin} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          <Link href={`/notes/${post.slug}`} className="focus:outline-none">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {post.categories.map((cat) => (
              <span
                key={cat.id}
                className="rounded-md border border-border/80 bg-secondary/50 px-2 py-0.5 font-mono text-[11px] text-primary"
              >
                #{cat.slug}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Read link */}
      <div className="mt-6 border-t border-border/60 pt-4">
        <Link
          href={`/notes/${post.slug}`}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-primary hover:underline"
        >
          <span>Read Engineering Note</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
