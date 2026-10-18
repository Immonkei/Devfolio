import { createPublicClient } from "@/lib/supabase/server";
import { NotesDirectory } from "@/components/public/notes-directory";
import { FileText } from "lucide-react";
import { PostWithCategories, Category } from "@/types";
import { getStandardPostsWithCategories } from "@/lib/constants/posts";

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
      posts = getStandardPostsWithCategories();
    }
  } catch (err) {
    console.error("Notes query error:", err);
    posts = getStandardPostsWithCategories();
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 space-y-10">
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
          Articles, practical tutorials, bug walkthroughs, and personal learnings from building web apps and services.
        </p>
      </div>

      {/* Directory with Search & Category Filters */}
      <NotesDirectory initialPosts={posts} />
    </div>
  );
}
