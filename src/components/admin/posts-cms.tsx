"use client";

import { useState } from "react";
import {
  createPost,
  updatePost,
  deletePost,
  togglePostPublish,
  syncStandardPosts,
} from "@/actions/posts";
import { uploadMediaFile } from "@/actions/media";
import { PostWithCategories, Category, PostStatus } from "@/types";
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NOTE_COVER_PRESETS = [
  { label: "Default Field Report", url: "/notes/default-note.svg" },
  { label: "Modular REST APIs & JWT", url: "/notes/modular-rest-apis.svg" },
  { label: "OOAD & Domain Modeling", url: "/notes/ooad-web-apps.svg" },
];

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
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deviceFileName, setDeviceFileName] = useState<string | null>(null);

  const handleSyncPosts = async () => {
    setSyncing(true);
    setError(null);
    setSyncSuccess(null);
    try {
      const res = await syncStandardPosts();
      if (res.success) {
        setSyncSuccess(res.message || "Standard notes synchronized!");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setError(res.error || "Failed to sync notes.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync error occurred.");
    } finally {
      setSyncing(false);
    }
  };

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
    setDeviceFileName(null);
    setUploadingImage(false);
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
    setDeviceFileName(null);
    setUploadingImage(false);
    setIsEditing(true);
  };

  const handleDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 10 * 1024 * 1024) {
      setError("Device image exceeds 10MB limit.");
      return;
    }

    setUploadingImage(true);
    setDeviceFileName(file.name);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadMediaFile(formData);

      if (res.success && res.data?.url) {
        setForm((prev) => ({ ...prev, cover_image_url: res.data.url }));
      } else {
        setError(res.error || "Failed to upload file to storage bucket. Please check Supabase storage configuration.");
        setDeviceFileName(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Device upload exception.");
      setDeviceFileName(null);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleResetCover = () => {
    setForm((prev) => ({ ...prev, cover_image_url: "/notes/default-note.svg" }));
    setDeviceFileName(null);
  };

  const handleClearCover = () => {
    setForm((prev) => ({ ...prev, cover_image_url: "" }));
    setDeviceFileName(null);
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
          const updatedRecord = res.data;
          setPosts(
            posts.map((p) =>
              p.id === editingId
                ? {
                    ...p,
                    ...(updatedRecord || form),
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
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSyncPosts}
              disabled={syncing}
              variant="outline"
              size="sm"
              className="gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-primary" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync Standard Notes"}</span>
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              className="gap-1.5 font-mono text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Draft New Note</span>
            </Button>
          </div>
        )}
      </div>

      {syncSuccess && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400">
          {syncSuccess}
        </div>
      )}

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

            {/* Cover Image Thumbnail Section */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="text-foreground font-semibold flex items-center gap-2">
                    <span>Cover Image (Thumbnail)</span>
                    {uploadingImage && (
                      <span className="text-[11px] text-primary animate-pulse font-normal">
                        (Uploading file...)
                      </span>
                    )}
                  </label>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Attach directly from device, paste an image URL, or pick a preset thumbnail.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleResetCover}
                    className="text-xs text-primary hover:underline font-mono cursor-pointer"
                    title="Reset cover to default field report SVG"
                  >
                    Reset to Fallback
                  </button>
                  {form.cover_image_url && (
                    <>
                      <span className="text-muted-foreground/40">•</span>
                      <button
                        type="button"
                        onClick={handleClearCover}
                        className="text-xs text-muted-foreground hover:text-destructive font-mono cursor-pointer"
                        title="Clear cover field"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Attach from Device + URL Input */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative shrink-0">
                  <input
                    type="file"
                    id="post-device-image-input"
                    accept="image/*"
                    onChange={handleDeviceImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <label
                    htmlFor="post-device-image-input"
                    className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-xs font-mono font-medium transition-colors cursor-pointer w-full sm:w-auto shadow-xs ${
                      uploadingImage
                        ? "bg-secondary/50 text-muted-foreground border-border cursor-not-allowed"
                        : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:border-primary/50"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{uploadingImage ? "Uploading Image..." : "Attach from Device"}</span>
                  </label>
                </div>

                <div className="flex-1">
                  <Input
                    placeholder="/notes/default-note.svg or https://images.unsplash.com/..."
                    value={form.cover_image_url}
                    onChange={(e) => {
                      setForm({ ...form, cover_image_url: e.target.value });
                      setDeviceFileName(null);
                    }}
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground font-mono">Quick Preset Thumbnails:</span>
                <div className="flex flex-wrap gap-1.5">
                  {NOTE_COVER_PRESETS.map((preset) => {
                    const isSelected = form.cover_image_url === preset.url;
                    return (
                      <button
                        type="button"
                        key={preset.url}
                        onClick={() => {
                          setForm({ ...form, cover_image_url: preset.url });
                          setDeviceFileName(null);
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary/20 text-primary border-primary font-bold shadow-sm"
                            : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="rounded-lg border border-border/80 bg-secondary/20 p-3.5 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative aspect-[16/9] w-48 shrink-0 overflow-hidden rounded-md border border-border/70 bg-card shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.cover_image_url || "/notes/default-note.svg"}
                    alt="Note Cover Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-xs font-mono space-y-1 text-muted-foreground min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        form.cover_image_url && form.cover_image_url !== "/notes/default-note.svg"
                          ? "bg-emerald-400"
                          : "bg-cyan-400 animate-pulse"
                      }`}
                    />
                    <span className="font-semibold text-foreground">
                      {form.cover_image_url && form.cover_image_url !== "/notes/default-note.svg"
                        ? deviceFileName
                          ? `Device File Attached (${deviceFileName})`
                          : "Custom Cover Image Configured"
                        : "Default Fallback Field Report Active"}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed break-all">
                    {form.cover_image_url
                      ? `Active: ${form.cover_image_url.startsWith("data:") ? "Local File (base64 Data URL)" : form.cover_image_url}`
                      : "No custom image specified. The system will automatically use the default field report blueprint (/notes/default-note.svg)."}
                  </p>
                </div>
              </div>
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
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border border-border/70 bg-secondary/40 shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.cover_image_url || "/notes/default-note.svg"}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate max-w-xs">{post.title}</div>
                          <div className="text-[10px] text-muted-foreground line-clamp-1">{post.excerpt}</div>
                        </div>
                      </div>
                    </td>
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
