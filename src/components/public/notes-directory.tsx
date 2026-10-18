"use client";

import { useState, useMemo } from "react";
import { NoteCard } from "@/components/public/note-card";
import { PostWithCategories } from "@/types";
import { Search, X, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";

export function NotesDirectory({ initialPosts }: { initialPosts: PostWithCategories[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts by search query (title, excerpt, content)
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return initialPosts;
    const query = searchQuery.toLowerCase();
    return initialPosts.filter((post) => {
      const inTitle = post.title.toLowerCase().includes(query);
      const inExcerpt = (post.excerpt || "").toLowerCase().includes(query);
      const inContent = (post.content || "").toLowerCase().includes(query);
      return inTitle || inExcerpt || inContent;
    });
  }, [initialPosts, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9.5 pr-8 font-mono text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          <span>Showing </span>
          <span className="font-bold text-foreground">{filteredPosts.length}</span>
          <span> of {initialPosts.length} notes</span>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <div className="space-y-1">
            <h3 className="font-mono text-sm font-semibold text-foreground">
              No matching notes found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No notes matched &quot;{searchQuery}&quot;.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3.5 py-1.5 font-mono text-xs text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <span>Clear Search</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <NoteCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
