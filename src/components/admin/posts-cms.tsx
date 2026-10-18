"use client";

import { useState, useRef } from "react";
import {
  createPost,
  updatePost,
  deletePost,
  togglePostPublish,
  syncStandardPosts,
  ensureCategory,
} from "@/actions/posts";
import {
  uploadMediaFile,
  uploadMultipleMediaFiles,
  UploadedMediaResult,
} from "@/actions/media";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";
import { PostWithCategories, Category, PostStatus } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Code,
  FileCode,
  Quote,
  AlertCircle,
  List,
  ListOrdered,
  Table as TableIcon,
  Minus,
  CheckSquare,
  Link as LinkIcon,
  Sparkles,
  Columns,
  Copy,
  Check,
  FileText,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NOTE_COVER_PRESETS = [
  { label: "Default Field Report", url: "/notes/default-note.svg" },
  { label: "Modular REST APIs & JWT", url: "/notes/modular-rest-apis.svg" },
  { label: "OOAD & Domain Modeling", url: "/notes/ooad-web-apps.svg" },
];

const WRITING_STARTERS = [
  {
    id: "clean-starter",
    label: "📝 Clean Note / Article",
    description: "Introduction, what you built or solved, code example, key takeaways",
    content: `## What this note covers
A brief overview of what you built, solved, or learned.

## Implementation & Code
\`\`\`typescript
// Add your code or explanation here
const solution = "Clean, maintainable solution";
\`\`\`

## Key Takeaways
- Main insight or tip
- What to keep in mind
`,
  },
  {
    id: "quick-snippet",
    label: "⚡ Quick Tip / Problem & Fix",
    description: "The issue faced and how you solved it",
    content: `## The Issue
Brief note on what broke or caused friction.

## How to Fix It
\`\`\`bash
# The solution or fix
\`\`\`

> [!TIP]
> Why this happens and what to remember.
`,
  },
];

export function PostsCMS({
  initialPosts,
  allCategories,
}: {
  initialPosts: PostWithCategories[];
  allCategories: Category[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(allCategories);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  // Cover image upload
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);

  // Multi-image asset management
  const [attachedImages, setAttachedImages] = useState<UploadedMediaResult[]>([]);
  const [uploadingMultiImages, setUploadingMultiImages] = useState(false);
  const [multiUploadStatus, setMultiUploadStatus] = useState<string | null>(null);
  const [copiedTagUrl, setCopiedTagUrl] = useState<string | null>(null);

  // Dynamic custom tag input
  const [newTagInput, setNewTagInput] = useState("");
  const [addingTag, setAddingTag] = useState(false);

  // Editor mode: write | preview | split
  const [editorMode, setEditorMode] = useState<"write" | "preview" | "split">("write");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    setCoverFileName(null);
    setAttachedImages([]);
    setUploadingCover(false);
    setUploadingMultiImages(false);
    setMultiUploadStatus(null);
    setEditorMode("write");
    setNewTagInput("");
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
    setCoverFileName(null);
    setAttachedImages([]);
    setUploadingCover(false);
    setUploadingMultiImages(false);
    setMultiUploadStatus(null);
    setEditorMode("write");
    setNewTagInput("");
    setIsEditing(true);
  };

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

  // Helper: Insert text or wrap selection in textarea
  const insertFormatting = (prefix: string, suffix = "", defaultText = "") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setForm((prev) => ({
        ...prev,
        content: prev.content + `\n${prefix}${defaultText}${suffix}\n`,
      }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = form.content.substring(start, end) || defaultText;
    const replacement = `${prefix}${selection}${suffix}`;

    const newContent =
      form.content.substring(0, start) + replacement + form.content.substring(end);

    setForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selection.length
      );
    }, 50);
  };

  // Template loader
  const handleApplyTemplate = (templateContent: string) => {
    if (
      form.content.trim().length > 0 &&
      !confirm("Add this starter outline into your article?")
    ) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      content:
        prev.content.trim().length === 0
          ? templateContent
          : prev.content + "\n\n" + templateContent,
    }));
  };

  // Single Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 10 * 1024 * 1024) {
      setError("Cover image exceeds 10MB limit.");
      return;
    }

    setUploadingCover(true);
    setCoverFileName(file.name);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadMediaFile(formData);

      if (res.success && res.data?.url) {
        setForm((prev) => ({ ...prev, cover_image_url: res.data.url }));
      } else {
        setError(res.error || "Failed to upload cover image.");
        setCoverFileName(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Cover upload exception.");
      setCoverFileName(null);
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  // Multiple Images Upload
  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMultiImages(true);
    setMultiUploadStatus(`Uploading ${files.length} image(s)...`);
    setError(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await uploadMultipleMediaFiles(formData);

      if (res.success && res.data && res.data.length > 0) {
        setAttachedImages((prev) => [...prev, ...res.data]);
        setMultiUploadStatus(
          `Successfully uploaded ${res.data.length} image(s). Click 'Insert' to add to article.`
        );

        if (!form.cover_image_url || form.cover_image_url === "/notes/default-note.svg") {
          setForm((prev) => ({ ...prev, cover_image_url: res.data[0].url }));
        }
      } else {
        setError(res.error || "Failed to upload one or more images.");
        setMultiUploadStatus(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Multi-image upload exception.");
      setMultiUploadStatus(null);
    } finally {
      setUploadingMultiImages(false);
      e.target.value = "";
    }
  };

  // Insert image markdown tag into editor
  const handleInsertImageTag = (img: UploadedMediaResult) => {
    const cleanAlt = img.fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    insertFormatting(`![${cleanAlt}](`, ")", img.url);
  };

  // Insert all attached images as a multi-image gallery
  const handleInsertAllAsGallery = () => {
    if (attachedImages.length === 0) return;
    const galleryMarkdown =
      "\n" +
      attachedImages
        .map((img) => {
          const cleanAlt = img.fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
          return `![${cleanAlt}](${img.url})`;
        })
        .join("\n") +
      "\n";

    setForm((prev) => ({
      ...prev,
      content: prev.content + "\n" + galleryMarkdown,
    }));
  };

  const handleCopyTag = async (img: UploadedMediaResult) => {
    const cleanAlt = img.fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    const tag = `![${cleanAlt}](${img.url})`;
    try {
      await navigator.clipboard.writeText(tag);
      setCopiedTagUrl(img.url);
      setTimeout(() => setCopiedTagUrl(null), 2000);
    } catch (err) {
      console.warn("Clipboard copy failure:", err);
    }
  };

  // Handle adding custom topic / tag dynamically
  const handleAddNewTag = async () => {
    const raw = newTagInput.trim().replace(/^#+/, "").trim();
    if (!raw) return;

    // Check if already in categoriesList
    const existing = categoriesList.find(
      (c) =>
        c.name.toLowerCase() === raw.toLowerCase() ||
        c.slug.toLowerCase() === raw.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    );

    if (existing) {
      if (!form.category_ids.includes(existing.id)) {
        setForm((prev) => ({
          ...prev,
          category_ids: [...prev.category_ids, existing.id],
        }));
      }
      setNewTagInput("");
      return;
    }

    setAddingTag(true);
    try {
      const res = await ensureCategory(raw);
      if (res.success && res.data) {
        const newCat = res.data;
        setCategoriesList((prev) => [...prev, newCat]);
        setForm((prev) => ({
          ...prev,
          category_ids: [...prev.category_ids, newCat.id],
        }));
        setNewTagInput("");
      } else {
        setError(res.error || "Failed to add tag.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating tag.");
    } finally {
      setAddingTag(false);
    }
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
                    categories: categoriesList.filter((c) =>
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
            categories: categoriesList.filter((c) =>
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

  // Live article metrics
  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const activeCategories = categoriesList.filter((c) => form.category_ids.includes(c.id));
  const suggestedCategories = categoriesList.filter((c) => !form.category_ids.includes(c.id));

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
            Engineering Notes CMS
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Author and publish notes, tutorials, tips, and experiments with multi-image support and custom tags.
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

      {/* Editor Modal / Workspace */}
      {isEditing && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="font-mono text-base font-bold text-foreground">
                {editingId ? "Edit Note" : "Draft New Note"}
              </h2>
            </div>
            <button
              onClick={resetForm}
              className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-foreground font-semibold">Title *</label>
                <Input
                  required
                  placeholder="e.g. How I Optimized API Response Time with Redis"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm({
                      ...form,
                      title,
                      slug: editingId
                        ? form.slug
                        : title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, ""),
                    });
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Slug *</label>
                <Input
                  required
                  placeholder="how-i-optimized-api-response-time"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1">
              <label className="text-foreground font-semibold">Excerpt / Summary *</label>
              <Input
                required
                placeholder="A concise summary for article listings and search engines"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>

            {/* 1. COVER IMAGE SECTION */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="text-foreground font-semibold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>Featured Cover Banner</span>
                    {uploadingCover && (
                      <span className="text-[11px] text-primary animate-pulse font-normal">
                        (Uploading cover...)
                      </span>
                    )}
                  </label>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    The top visual hero of this note. Pick a preset, paste a URL, or attach from device.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, cover_image_url: "/notes/default-note.svg" }));
                      setCoverFileName(null);
                    }}
                    className="text-xs text-primary hover:underline font-mono cursor-pointer"
                  >
                    Reset to Fallback
                  </button>
                  {form.cover_image_url && (
                    <>
                      <span className="text-muted-foreground/40">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, cover_image_url: "" }));
                          setCoverFileName(null);
                        }}
                        className="text-xs text-muted-foreground hover:text-destructive font-mono cursor-pointer"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Cover Presets & Upload */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative shrink-0">
                  <input
                    type="file"
                    id="post-cover-image-input"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploadingCover}
                    className="hidden"
                  />
                  <label
                    htmlFor="post-cover-image-input"
                    className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-xs font-mono font-medium transition-colors cursor-pointer w-full sm:w-auto shadow-xs ${
                      uploadingCover
                        ? "bg-secondary/50 text-muted-foreground border-border cursor-not-allowed"
                        : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:border-primary/50"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{uploadingCover ? "Uploading Cover..." : "Upload Cover Banner"}</span>
                  </label>
                </div>

                <div className="flex-1">
                  <Input
                    placeholder="/notes/default-note.svg or https://images.unsplash.com/..."
                    value={form.cover_image_url}
                    onChange={(e) => {
                      setForm({ ...form, cover_image_url: e.target.value });
                      setCoverFileName(null);
                    }}
                  />
                  {coverFileName && (
                    <p className="text-[11px] text-emerald-500 font-mono mt-1">
                      Attached from device: {coverFileName}
                    </p>
                  )}
                </div>
              </div>

              {/* Cover Preset Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-muted-foreground font-mono mr-1">Presets:</span>
                {NOTE_COVER_PRESETS.map((preset) => {
                  const isSelected = form.cover_image_url === preset.url;
                  return (
                    <button
                      type="button"
                      key={preset.url}
                      onClick={() => {
                        setForm({ ...form, cover_image_url: preset.url });
                        setCoverFileName(null);
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

            {/* 2. MULTI-IMAGE UPLOADER & ASSET STRIP */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="text-foreground font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span>Article Media & Multi-Image Uploader</span>
                  </label>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Upload multiple diagrams, screenshots, or code images. Insert them directly into the article as single images or responsive multi-photo galleries.
                  </p>
                </div>

                {attachedImages.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleInsertAllAsGallery}
                    className="gap-1.5 font-mono text-xs text-primary border-primary/40 hover:bg-primary/10"
                  >
                    <Columns className="h-3.5 w-3.5" />
                    <span>Insert All as Gallery Grid</span>
                  </Button>
                )}
              </div>

              {/* Multi-file Input Area */}
              <div className="rounded-xl border border-dashed border-border/80 bg-secondary/15 p-4 text-center">
                <input
                  type="file"
                  id="post-multi-images-input"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleImagesUpload}
                  disabled={uploadingMultiImages}
                  className="hidden"
                />
                <label
                  htmlFor="post-multi-images-input"
                  className="inline-flex flex-col items-center justify-center gap-2 cursor-pointer w-full"
                >
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Upload className={`h-5 w-5 ${uploadingMultiImages ? "animate-bounce" : ""}`} />
                  </div>
                  <div className="text-xs font-mono">
                    <span className="font-semibold text-primary underline underline-offset-2">
                      Click to select multiple images
                    </span>{" "}
                    <span className="text-muted-foreground">or drag & drop here (PNG, JPG, SVG, WebP up to 10MB each)</span>
                  </div>
                </label>
              </div>

              {multiUploadStatus && (
                <div className="rounded-lg border border-primary/30 bg-primary/10 p-2.5 font-mono text-[11px] text-primary flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{multiUploadStatus}</span>
                </div>
              )}

              {/* Attached Images Asset Strip */}
              {attachedImages.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Uploaded Assets ({attachedImages.length}):</span>
                    <span>Click &apos;Insert&apos; to paste into markdown text</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {attachedImages.map((img, iIdx) => (
                      <div
                        key={iIdx}
                        className="group flex items-center gap-2.5 rounded-lg border border-border bg-card p-2 shadow-xs hover:border-primary/50 transition-colors"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-border/70 bg-secondary/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.fileName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="truncate font-mono text-[11px] text-foreground font-medium">
                            {img.fileName}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleInsertImageTag(img)}
                              className="text-[10px] text-primary hover:underline font-mono flex items-center gap-0.5 cursor-pointer font-bold"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Insert</span>
                            </button>
                            <span className="text-muted-foreground/40">•</span>
                            <button
                              type="button"
                              onClick={() => handleCopyTag(img)}
                              className="text-[10px] text-muted-foreground hover:text-foreground font-mono flex items-center gap-0.5 cursor-pointer"
                            >
                              {copiedTagUrl === img.url ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              <span>{copiedTagUrl === img.url ? "Copied" : "Copy Tag"}</span>
                            </button>
                            <span className="text-muted-foreground/40">•</span>
                            <button
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, cover_image_url: img.url }))}
                              className="text-[10px] text-muted-foreground hover:text-primary font-mono cursor-pointer"
                              title="Set as note cover banner"
                            >
                              Cover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. OPTIONAL WRITING STARTERS (NO RIGID TOPICS) */}
            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <label className="text-foreground font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Optional Starters (Unrestricted)</span>
                </label>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Optional writing skeletons — feel free to write blank or in any structure you prefer
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {WRITING_STARTERS.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl.content)}
                    className="flex flex-col text-left rounded-lg border border-border bg-secondary/30 p-2.5 hover:border-primary hover:bg-secondary/60 transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                      {tmpl.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                      {tmpl.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. MARKDOWN TOOLBAR & VIEW MODE SWITCHER */}
            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-foreground font-semibold">
                  Article Content (Markdown Supported) *
                </label>

                {/* View Switcher: Write | Preview | Split */}
                <div className="inline-flex rounded-lg border border-border bg-secondary/50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setEditorMode("write")}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                      editorMode === "write"
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("preview")}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                      editorMode === "preview"
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("split")}
                    className={`hidden md:inline-flex px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                      editorMode === "split"
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Split View
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-secondary/40 p-1.5 text-muted-foreground">
                <button
                  type="button"
                  title="Heading 2 (##)"
                  onClick={() => insertFormatting("## ", "\n", "Section Title")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <Heading2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Heading 3 (###)"
                  onClick={() => insertFormatting("### ", "\n", "Subsection Title")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <Heading3 className="h-4 w-4" />
                </button>
                <span className="text-border mx-0.5">|</span>
                <button
                  type="button"
                  title="Bold (**text**)"
                  onClick={() => insertFormatting("**", "**", "bold text")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Italic (*text*)"
                  onClick={() => insertFormatting("*", "*", "italic text")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Inline Code (`code`)"
                  onClick={() => insertFormatting("`", "`", "variableName")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <Code className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Code Block (```typescript)"
                  onClick={() =>
                    insertFormatting(
                      "```typescript\n",
                      "\n```\n",
                      "// Write implementation here\nconst result = await processTask();"
                    )
                  }
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <FileCode className="h-4 w-4" />
                </button>
                <span className="text-border mx-0.5">|</span>
                <button
                  type="button"
                  title="Note Callout (> [!NOTE])"
                  onClick={() =>
                    insertFormatting(
                      "> [!NOTE]\n> ",
                      "\n",
                      "Key background insight or context"
                    )
                  }
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <AlertCircle className="h-4 w-4 text-sky-400" />
                </button>
                <button
                  type="button"
                  title="Tip Callout (> [!TIP])"
                  onClick={() =>
                    insertFormatting(
                      "> [!TIP]\n> ",
                      "\n",
                      "Performance optimization or recommended pattern"
                    )
                  }
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                </button>
                <button
                  type="button"
                  title="Blockquote (> quote)"
                  onClick={() => insertFormatting("> ", "\n", "Quoted text")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <Quote className="h-4 w-4" />
                </button>
                <span className="text-border mx-0.5">|</span>
                <button
                  type="button"
                  title="Bullet List (- item)"
                  onClick={() => insertFormatting("- ", "\n", "List item")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Numbered List (1. item)"
                  onClick={() => insertFormatting("1. ", "\n", "Numbered item")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <ListOrdered className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Checklist Item (- [ ] task)"
                  onClick={() => insertFormatting("- [ ] ", "\n", "Task to complete")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <CheckSquare className="h-4 w-4" />
                </button>
                <span className="text-border mx-0.5">|</span>
                <button
                  type="button"
                  title="Markdown Table"
                  onClick={() =>
                    insertFormatting(
                      "\n| Item | Description |\n| --- | --- |\n| Example 1 | Detail here |\n"
                    )
                  }
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <TableIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Horizontal Divider (---)"
                  onClick={() => insertFormatting("\n---\n")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Hyperlink ([text](url))"
                  onClick={() => insertFormatting("[", "](https://example.com)", "link title")}
                  className="rounded p-1.5 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Editor / Live Preview Display */}
              {editorMode === "write" && (
                <Textarea
                  ref={textareaRef}
                  required
                  rows={14}
                  placeholder="Write your note, code blocks, diagrams, and thoughts freely..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="font-mono text-xs leading-relaxed"
                />
              )}

              {editorMode === "preview" && (
                <div className="rounded-xl border border-border bg-card p-6 min-h-[350px] overflow-y-auto max-h-[600px]">
                  {form.content.trim() ? (
                    <MarkdownRenderer content={form.content} />
                  ) : (
                    <div className="text-center text-muted-foreground font-mono text-xs py-12">
                      No markdown content written yet. Switch to &apos;Write&apos; mode to compose your article.
                    </div>
                  )}
                </div>
              )}

              {editorMode === "split" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea
                    ref={textareaRef}
                    required
                    rows={16}
                    placeholder="Write your note, code blocks, diagrams, and thoughts freely..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="font-mono text-xs leading-relaxed"
                  />
                  <div className="rounded-xl border border-border bg-card p-4 min-h-[350px] overflow-y-auto max-h-[600px]">
                    <MarkdownRenderer content={form.content || "*Preview will appear here...*"} />
                  </div>
                </div>
              )}

              {/* Metrics Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                <div className="flex items-center gap-3">
                  <span>{wordCount.toLocaleString()} words</span>
                  <span>•</span>
                  <span>{form.content.length.toLocaleString()} characters</span>
                  <span>•</span>
                  <span className="text-primary font-semibold">~{readTimeMin} min read</span>
                </div>
                <span>Markdown + GitHub Alerts Enabled</span>
              </div>
            </div>

            {/* 5. DYNAMIC CUSTOM TAGS / TOPICS (100% UNRESTRICTED) */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <label className="text-foreground font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span>Topics & Tags (Optional & Flexible)</span>
                  </label>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Type any topic or tag (e.g. React, Docker, Tips, BugFix, Next.js). You are never restricted to fixed topics!
                  </p>
                </div>
                {form.category_ids.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, category_ids: [] }))}
                    className="text-xs text-muted-foreground hover:text-destructive font-mono cursor-pointer"
                  >
                    Clear all tags
                  </button>
                )}
              </div>

              {/* Add Custom Tag Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                    #
                  </span>
                  <Input
                    placeholder="Type custom tag (e.g. Docker, Tips, React)..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNewTag();
                      }
                    }}
                    className="pl-7 font-mono text-xs"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddNewTag}
                  disabled={!newTagInput.trim() || addingTag}
                  className="font-mono text-xs gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{addingTag ? "Adding..." : "Add Tag"}</span>
                </Button>
              </div>

              {/* Active Tags on this Note */}
              {activeCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-muted-foreground font-mono mr-1">
                    Attached to this note:
                  </span>
                  {activeCategories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center gap-1 rounded-md bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 text-xs font-mono font-semibold"
                    >
                      #{cat.name}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className="hover:text-destructive ml-0.5 cursor-pointer"
                        title="Remove tag"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested / Previous Tags */}
              {suggestedCategories.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Suggested tags from previous notes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedCategories.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleCategory(c.id)}
                        className="rounded-md border border-border bg-secondary/30 px-2.5 py-0.5 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                      >
                        + #{c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Publish Toggle */}
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
                <span className="font-semibold">Publish Immediately</span>
              </label>
            </div>

            {/* Actions */}
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

      {/* Table of Existing Posts */}
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
                  <td className="p-4 font-semibold text-foreground max-w-xs truncate">
                    {post.title}
                  </td>
                  <td className="p-4 text-muted-foreground max-w-[200px] truncate">
                    {post.slug}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(post.id, post.status)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        post.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {post.status === "PUBLISHED" ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      <span>{post.status}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(post)}
                        title="Edit note"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(post.id)}
                        title="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
