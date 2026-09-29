import { createPublicClient } from "@/lib/supabase/server";
import { NoteCard } from "@/components/public/note-card";
import { FileText, BookOpen } from "lucide-react";
import { PostWithCategories, Category } from "@/types";
import { STANDARD_POSTS } from "@/lib/constants/posts";

export const metadata = {
  title: "Engineering Notes",
  description: "Technical essays, architecture decisions, database optimizations, and system design post-mortems.",
};

export const revalidate = 60;

export default async function NotesPage() {
  let posts: PostWithCategories[] = [];

  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("posts")
      .select("*, post_categories(category_id, categories(*))")
      .eq("status", "PUBLISHED")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      posts = data.map((p) => ({
        ...p,
        categories: (p.post_categories || []).map((pc: { categories: Category | null }) => pc.categories).filter(Boolean) as Category[],
      }));
    } else {
      posts = STANDARD_POSTS.map((p) => ({
        ...p,
        categories: p.category_slugs.map((slug) => ({ id: `cat-${slug}`, name: slug.toUpperCase(), slug })),
        created_at: p.published_at,
        updated_at: p.published_at,
      }));
    }
  } catch (err) {
    console.error("Notes query error:", err);
    posts = STANDARD_POSTS.map((p) => ({
      ...p,
      categories: p.category_slugs.map((slug) => ({ id: `cat-${slug}`, name: slug.toUpperCase(), slug })),
      created_at: p.published_at,
      updated_at: p.published_at,
    }));
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider">
          <FileText className="h-4 w-4" />
          <span>Technical Knowledge Base</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Engineering Notes & Field Reports
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
          Deep-dive technical essays on systems design, distributed concurrency, PostgreSQL optimization, and architectural lessons learned from production.
        </p>
      </div>

      {/* Notes Grid */}
      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
          <p className="font-mono text-xs text-muted-foreground">
            No published notes currently available. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <NoteCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
