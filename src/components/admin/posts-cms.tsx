"use client";

import { useState } from "react";
import {
  createPost,
  updatePost,
  deletePost,
  togglePostPublish,
} from "@/actions/posts";
import { PostWithCategories, Category, PostStatus } from "@/types";
import { Plus, Edit2, Trash2, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PostsCMS({
  initialPosts,
  allCategories,
}: {
  initialPosts: PostWithCategories[];
  allCategories: Category[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    status: "DRAFT" as PostStatus,
    category_ids: [] as string[],
  });

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image_url: "",
      status: "DRAFT",
      category_ids: [],
    });
    setEditingId(null);
    setIsEditing(false);
    setError(null);
  };

  const handleEdit = (p: PostWithCategories) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      cover_image_url: p.cover_image_url || "",
      status: p.status,
      category_ids: (p.categories || []).map((c) => c.id),
    });
    setIsEditing(true);
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const res = await togglePostPublish(id, currentStatus);
    if (res.success && res.newStatus) {
      setPosts(
        posts.map((p) =>
          p.id === id ? { ...p, status: res.newStatus as PostStatus } : p
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm deleting this technical note?")) return;
    const res = await deletePost(id);
    if (res.success) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        const res = await updatePost(editingId, form);
        if (!res.success) {
          setError(res.error || "Update failed.");
        } else {
          setPosts(
            posts.map((p) =>
              p.id === editingId
                ? {
                    ...p,
                    ...form,
                    categories: allCategories.filter((c) =>
                      form.category_ids.includes(c.id)
                    ),
                  }
                : p
            )
          );
          resetForm();
        }
      } else {
        const res = await createPost(form);
        if (!res.success) {
          setError(res.error || "Creation failed.");
        } else if (res.data) {
          const newPost = {
            ...res.data,
            categories: allCategories.filter((c) =>
              form.category_ids.includes(c.id)
            ),
          } as PostWithCategories;
          setPosts([newPost, ...posts]);
          resetForm();
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An exception occurred.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (catId: string) => {
    setForm((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(catId)
        ? prev.category_ids.filter((id) => id !== catId)
        : [...prev.category_ids, catId],
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
            Engineering Notes CMS
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Author and publish architectural essays, post-mortems, and field notes.
          </p>
        </div>

        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            className="gap-1.5 font-mono text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Draft New Note</span>
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-mono text-base font-bold text-foreground">
              {editingId ? "Edit Note" : "Draft New Technical Article"}
            </h2>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-foreground font-semibold">Title *</label>
                <Input
                  required
                  placeholder="e.g. PostgreSQL RLS Production Guide"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm({
                      ...form,
                      title,
                      slug: editingId ? form.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
                    });
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Slug *</label>
                <Input
                  required
                  placeholder="postgresql-rls-production-guide"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-foreground font-semibold">Excerpt / Abstract *</label>
              <Input
                required
                placeholder="A concise summary for article listings and search engines"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-foreground font-semibold">Article Content (Markdown Supported) *</label>
              <Textarea
                required
                rows={12}
                placeholder="Write technical analysis, code blocks, and diagrams here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            {/* Categories */}
            {allCategories.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-foreground font-semibold">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((c) => {
                    const selected = form.category_ids.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleCategory(c.id)}
                        className={`px-2.5 py-1 rounded-md text-xs border transition-colors cursor-pointer ${
                          selected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        #{c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  checked={form.status === "PUBLISHED"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.checked ? "PUBLISHED" : "DRAFT",
                    })
                  }
                  className="rounded border-input text-primary"
                />
                <span>Publish Immediately</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} size="sm">
                {loading ? "Persisting..." : editingId ? "Commit Edits" : "Create Note"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead className="border-b border-border bg-secondary/50 text-muted-foreground text-left">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No notes recorded yet.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-semibold text-foreground">{post.title}</td>
                  <td className="p-4 text-muted-foreground">/{post.slug}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(post.id, post.status)}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] cursor-pointer ${
                        post.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-secondary text-muted-foreground border-border"
                      }`}
                    >
                      {post.status === "PUBLISHED" ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      <span>{post.status}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
