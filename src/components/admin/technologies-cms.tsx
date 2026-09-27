/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  createTechnology,
  updateTechnology,
  deleteTechnology,
  syncStandardTechnologies,
} from "@/actions/technologies";
import { Technology, TechCategory } from "@/types";
import { Plus, Edit2, Trash2, X, RefreshCw, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTechIconUrl, suggestTechCategory, suggestTechIcon } from "@/lib/tech-icons";

const CATEGORIES: TechCategory[] = [
  "LANGUAGE",
  "FRAMEWORK",
  "DATABASE",
  "DEVOPS",
  "TOOL",
  "OTHER",
];

export function TechnologiesCMS({ initialTechnologies }: { initialTechnologies: Technology[] }) {
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "TOOL" as TechCategory,
    icon: "",
  });

  const resetForm = () => {
    setForm({ name: "", category: "TOOL", icon: "" });
    setEditingId(null);
    setIsEditing(false);
    setError(null);
  };

  const handleNameChange = (newName: string) => {
    if (!editingId) {
      // Automatically detect and suggest category and icon
      const suggestedCat = suggestTechCategory(newName);
      const suggestedIcon = suggestTechIcon(newName);
      setForm({
        name: newName,
        category: suggestedCat,
        icon: suggestedIcon,
      });
    } else {
      setForm((prev) => ({ ...prev, name: newName }));
    }
  };

  const handleEdit = (t: Technology) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      category: t.category,
      icon: t.icon || "",
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm deleting this technology?")) return;
    const res = await deleteTechnology(id);
    if (res.success) {
      setTechnologies(technologies.filter((t) => t.id !== id));
    }
  };

  const handleSyncStack = async () => {
    setSyncing(true);
    setError(null);
    setStatusMessage(null);
    try {
      const res = await syncStandardTechnologies();
      if (!res.success) {
        setError(res.error || "Failed to sync technologies.");
      } else {
        setStatusMessage(res.message || "Stack synchronized successfully.");
        // Refresh page/state if necessary
        window.location.reload();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sync error.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: form.name,
      category: form.category,
      icon: form.icon || null,
    };

    try {
      if (editingId) {
        const res = await updateTechnology(editingId, payload);
        if (!res.success) {
          setError(res.error || "Update failed.");
        } else if (res.data) {
          setTechnologies(technologies.map((t) => (t.id === editingId ? res.data : t)));
          resetForm();
        }
      } else {
        const res = await createTechnology(payload);
        if (!res.success) {
          setError(res.error || "Creation failed.");
        } else if (res.data) {
          setTechnologies([...technologies, res.data]);
          resetForm();
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An exception occurred.");
    } finally {
      setLoading(false);
    }
  };

  const previewIconUrl = getTechIconUrl(form.icon || null, form.name || null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
            Technologies CMS
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Manage production stack elements, languages, and infrastructure tools ({technologies.length} active).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSyncStack}
            disabled={syncing}
            variant="outline"
            size="sm"
            className="gap-1.5 font-mono text-xs border-primary/30 hover:bg-primary/10"
            title="Populates all 41 standard technologies into database"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-primary" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync All Standard Stack"}</span>
          </Button>

          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} size="sm" className="gap-1.5 font-mono text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Technology</span>
            </Button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {isEditing && (
        <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-mono text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{editingId ? "Update Technology" : "Register New Technology"}</span>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-foreground font-semibold">Technology Name *</label>
                <Input
                  required
                  placeholder="e.g. TypeScript, React, Go, Supabase"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">Category & icon auto-detect as you type</p>
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as TechCategory })}
                  className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground">Detected automatically, editable</p>
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-semibold">Icon Identifier</label>
                <Input
                  placeholder="e.g. typescript, react, go"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
                <p className="text-[10px] text-muted-foreground">Optional key or custom image URL</p>
              </div>
            </div>

            {/* Live Icon Detection Preview */}
            <div className="rounded-lg border border-border/80 bg-secondary/30 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center p-1.5 shadow-sm">
                  {previewIconUrl ? (
                    <img
                      src={previewIconUrl}
                      alt={form.name || "Preview"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {form.name ? form.name[0]?.toUpperCase() : "?"}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {form.name || "Live Icon Preview"}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {previewIconUrl
                      ? "Icon automatically detected and ready"
                      : "Type technology name to auto-resolve icon"}
                  </div>
                </div>
              </div>
              {previewIconUrl && (
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-mono">
                  Ready
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} size="sm">
                {loading ? "Persisting..." : editingId ? "Save Changes" : "Register Technology"}
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
              <th className="p-4">Technology</th>
              <th className="p-4">Category</th>
              <th className="p-4">Icon Key</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {technologies.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No technologies registered. Click &quot;Sync All Standard Stack&quot; above to seed all 41 items.
                </td>
              </tr>
            ) : (
              technologies.map((t) => {
                const iconUrl = getTechIconUrl(t.icon, t.name);
                return (
                  <tr key={t.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-semibold text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded bg-secondary/60 border border-border/60 flex items-center justify-center p-1 shrink-0">
                          {iconUrl ? (
                            <img src={iconUrl} alt={t.name} className="h-full w-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-bold">
                              {t.name[0]?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span>{t.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-[10px] text-primary">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {t.icon ? (
                        <code className="text-[11px] text-foreground/80">{t.icon}</code>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60 italic">auto-detected</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          title="Edit technology"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete technology"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

