"use client";

import { useState } from "react";
import {
  createProject,
  updateProject,
  deleteProject,
  toggleProjectPublish,
} from "@/actions/projects";
import { ProjectWithTechnologies, Technology, ProjectStatus } from "@/types";
import { Plus, Edit2, Trash2, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProjectsCMS({
  initialProjects,
  allTechnologies,
}: {
  initialProjects: ProjectWithTechnologies[];
  allTechnologies: Technology[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    problem: "",
    solution: "",
    architecture: "",
    implementation: "",
    challenges: "",
    tradeoffs: "",
    results: "",
    cover_image_url: "",
    github_url: "",
    live_url: "",
    featured: false,
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    display_order: 0,
    technology_ids: [] as string[],
  });

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      short_description: "",
      description: "",
      problem: "",
      solution: "",
      architecture: "",
      implementation: "",
      challenges: "",
      tradeoffs: "",
      results: "",
      cover_image_url: "",
      github_url: "",
      live_url: "",
      featured: false,
      status: "DRAFT",
      display_order: 0,
      technology_ids: [],
    });
    setEditingId(null);
    setIsEditing(false);
    setError(null);
  };

  const handleEdit = (p: ProjectWithTechnologies) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      short_description: p.short_description,
      description: p.description,
      problem: p.problem || "",
      solution: p.solution || "",
      architecture: p.architecture || "",
      implementation: p.implementation || "",
      challenges: p.challenges || "",
      tradeoffs: p.tradeoffs || "",
      results: p.results || "",
      cover_image_url: p.cover_image_url || "",
      github_url: p.github_url || "",
      live_url: p.live_url || "",
      featured: p.featured,
      status: p.status,
      display_order: p.display_order,
      technology_ids: (p.technologies || []).map((t) => t.id),
    });
    setIsEditing(true);
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const res = await toggleProjectPublish(id, currentStatus);
    if (res.success && res.newStatus) {
      setProjects(
        projects.map((p) =>
          p.id === id ? { ...p, status: res.newStatus as ProjectStatus } : p
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm deleting this project from the database?")) return;
    const res = await deleteProject(id);
    if (res.success) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        const res = await updateProject(editingId, form);
        if (!res.success) {
          setError(res.error || "Update failed.");
        } else {
          setProjects(
            projects.map((p) =>
              p.id === editingId
                ? {
                    ...p,
                    ...form,
                    technologies: allTechnologies.filter((t) =>
                      form.technology_ids.includes(t.id)
                    ),
                  }
                : p
            )
          );
          resetForm();
        }
      } else {
        const res = await createProject(form);
        if (!res.success) {
          setError(res.error || "Creation failed.");
        } else if (res.data) {
          const newProj = {
            ...res.data,
            technologies: allTechnologies.filter((t) =>
              form.technology_ids.includes(t.id)
            ),
          } as ProjectWithTechnologies;
          setProjects([newProj, ...projects]);
          resetForm();
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An exception occurred.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTech = (techId: string) => {
    setForm((prev) => ({
      ...prev,
      technology_ids: prev.technology_ids.includes(techId)
        ? prev.technology_ids.filter((id) => id !== techId)
        : [...prev.technology_ids, techId],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
            Projects CMS
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Manage deep-dive technical architectural case studies.
          </p>
        </div>

        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            className="gap-1.5 font-mono text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Project</span>
          </Button>
        )}
      </div>

      {/* Editor Modal/Panel */}
      {isEditing && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-mono text-base font-bold text-foreground">
              {editingId ? "Update Project Spec" : "Compose New Project Case Study"}
            </h2>
            <button
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground"
            >
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
                  placeholder="e.g. Distributed Event Bus"
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
                  placeholder="distributed-event-bus"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-foreground font-semibold">Short Summary *</label>
              <Input
                required
                placeholder="High-level engineering overview for cards and meta tags"
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-foreground font-semibold">Full Narrative *</label>
              <Textarea
                required
                rows={3}
                placeholder="Detailed project context, operational objectives, and execution details"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Architecture Sections */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-2 border-t border-border">
              <div className="space-y-1">
                <label className="text-foreground font-semibold">Problem Statement</label>
                <Textarea
                  rows={2}
                  placeholder="The concrete bottleneck, scaling constraint, or failure scenario"
                  value={form.problem}
                  onChange={(e) => setForm({ ...form, problem: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Solution Strategy</label>
                <Textarea
                  rows={2}
                  placeholder="How the architectural design solved the problem"
                  value={form.solution}
                  onChange={(e) => setForm({ ...form, solution: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">System Architecture</label>
                <Textarea
                  rows={2}
                  placeholder="Data flow, component topologies, protocol selection"
                  value={form.architecture}
                  onChange={(e) => setForm({ ...form, architecture: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Technical Implementation</label>
                <Textarea
                  rows={2}
                  placeholder="Key algorithms, data structures, libraries, optimizations"
                  value={form.implementation}
                  onChange={(e) => setForm({ ...form, implementation: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Engineering Challenges</label>
                <Textarea
                  rows={2}
                  placeholder="Unforeseen bugs, race conditions, edge cases"
                  value={form.challenges}
                  onChange={(e) => setForm({ ...form, challenges: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Trade-offs & Decisions</label>
                <Textarea
                  rows={2}
                  placeholder="Why alternative X was rejected in favor of Y"
                  value={form.tradeoffs}
                  onChange={(e) => setForm({ ...form, tradeoffs: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-foreground font-semibold">Empirical Results</label>
              <Input
                placeholder="P99 latency dropped by 64%, throughput increased to 250k req/s"
                value={form.results}
                onChange={(e) => setForm({ ...form, results: e.target.value })}
              />
            </div>

            {/* Links and flags */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2 border-t border-border">
              <div className="space-y-1">
                <label className="text-foreground font-semibold">GitHub Repo URL</label>
                <Input
                  placeholder="https://github.com/..."
                  value={form.github_url}
                  onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Live Demo URL</label>
                <Input
                  placeholder="https://..."
                  value={form.live_url}
                  onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Cover Image URL</label>
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={form.cover_image_url}
                  onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                />
              </div>
            </div>

            {/* Technologies selection */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-foreground font-semibold">Associated Technologies</label>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map((t) => {
                  const selected = form.technology_ids.includes(t.id);
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => toggleTech(t.id)}
                      className={`px-2.5 py-1 rounded-md text-xs border transition-colors cursor-pointer ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-input text-primary"
                />
                <span>Featured Project</span>
              </label>

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
                {loading ? "Persisting..." : editingId ? "Commit Changes" : "Save Project"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="border-b border-border bg-secondary/50 text-muted-foreground text-left">
              <tr>
                <th className="p-4">Project</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tech Stack</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No projects found in database. Create one above.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{p.title}</td>
                    <td className="p-4 text-muted-foreground">/{p.slug}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(p.id, p.status)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] cursor-pointer ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-secondary text-muted-foreground border-border"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {p.status === "PUBLISHED" ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{p.status}</span>
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(p.technologies || []).map((t) => (
                          <span
                            key={t.id}
                            className="bg-secondary/60 px-1.5 py-0.5 rounded text-[10px] text-muted-foreground"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      {p.featured ? (
                        <span className="text-primary font-bold">YES</span>
                      ) : (
                        <span className="text-muted-foreground">NO</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete Project"
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
    </div>
  );
}
